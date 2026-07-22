import os

from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


def tokens_for(user):
    """Paire de jetons JWT (access court, refresh long) pour un utilisateur."""
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(APIView):
    """POST /api/auth/register/ — crée un compte apprenant et renvoie les jetons."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_register"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"user": UserSerializer(user).data, **tokens_for(user)}, status=201)


class LoginView(APIView):
    """POST /api/auth/login/ — connexion par e-mail + mot de passe."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or ""
        user = (
            User.objects.filter(email__iexact=email).first()
            or User.objects.filter(username__iexact=email).first()
        )
        if not user or not user.is_active or not user.check_password(password):
            return Response({"detail": "E-mail ou mot de passe incorrect."}, status=401)
        return Response({"user": UserSerializer(user).data, **tokens_for(user)})


class MeView(APIView):
    """GET /api/auth/me/ — profil de l'utilisateur connecté (jeton requis)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class GoogleLoginView(APIView):
    """POST /api/auth/google/ — connexion via un jeton d'identité Google.

    Le frontend récupère un `credential` (ID token) avec Google Identity Services
    et l'envoie ici. On le vérifie côté serveur avec `GOOGLE_CLIENT_ID`, puis on
    crée/retrouve le compte et on renvoie nos propres jetons JWT."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request):
        credential = request.data.get("credential") or request.data.get("id_token")
        client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
        if not credential:
            return Response({"detail": "Jeton Google manquant."}, status=400)
        if not client_id:
            return Response({"detail": "Connexion Google non configurée sur le serveur."}, status=503)

        # Import local : évite d'exiger google-auth si la vue n'est jamais appelée.
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token as google_id_token

        try:
            info = google_id_token.verify_oauth2_token(
                credential, google_requests.Request(), client_id
            )
        except ValueError:
            return Response({"detail": "Jeton Google invalide."}, status=401)

        email = (info.get("email") or "").strip().lower()
        if not email or not info.get("email_verified"):
            return Response({"detail": "E-mail Google non vérifié."}, status=401)

        name = (info.get("name") or "").strip()
        user = (
            User.objects.filter(email__iexact=email).first()
            or User.objects.filter(username__iexact=email).first()
        )
        if user is None:
            user = User(username=email, email=email, first_name=name[:150])
            user.set_unusable_password()  # compte Google : pas de mot de passe local
            user.save()
        return Response({"user": UserSerializer(user).data, **tokens_for(user)})

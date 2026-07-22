from django.test import TestCase
from rest_framework.test import APIClient

STRONG = "Str0ngPass!23"


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_login_me(self):
        # Inscription (e-mail avec majuscules → normalisé en minuscules)
        r = self.client.post(
            "/api/auth/register/",
            {"name": "Test User", "email": "Test@Example.com", "password": STRONG},
            format="json",
        )
        self.assertEqual(r.status_code, 201, r.content)
        self.assertIn("access", r.data)
        self.assertEqual(r.data["user"]["email"], "test@example.com")

        # Doublon refusé
        r2 = self.client.post(
            "/api/auth/register/",
            {"email": "test@example.com", "password": STRONG},
            format="json",
        )
        self.assertEqual(r2.status_code, 400)

        # Connexion
        r3 = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": STRONG},
            format="json",
        )
        self.assertEqual(r3.status_code, 200, r3.content)
        token = r3.data["access"]

        # /me avec le jeton
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        r4 = self.client.get("/api/auth/me/")
        self.assertEqual(r4.status_code, 200)
        self.assertEqual(r4.data["email"], "test@example.com")
        self.assertEqual(r4.data["name"], "Test User")

    def test_me_requires_auth(self):
        r = self.client.get("/api/auth/me/")
        self.assertEqual(r.status_code, 401)

    def test_login_bad_password(self):
        self.client.post(
            "/api/auth/register/",
            {"email": "a@b.com", "password": STRONG},
            format="json",
        )
        r = self.client.post(
            "/api/auth/login/",
            {"email": "a@b.com", "password": "mauvais"},
            format="json",
        )
        self.assertEqual(r.status_code, 401)

    def test_weak_password_rejected(self):
        r = self.client.post(
            "/api/auth/register/",
            {"email": "weak@b.com", "password": "1234"},
            format="json",
        )
        self.assertEqual(r.status_code, 400)

    def test_google_credential_handled(self):
        # Sans GOOGLE_CLIENT_ID configuré → 503 ; si configuré, jeton "x" → 401.
        r = self.client.post("/api/auth/google/", {"credential": "x"}, format="json")
        self.assertIn(r.status_code, (401, 503))

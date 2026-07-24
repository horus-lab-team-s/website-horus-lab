from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Représentation publique d'un apprenant (jamais le mot de passe)."""

    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email"]

    def get_name(self, obj):
        return (obj.get_full_name() or obj.first_name or obj.email or obj.username).strip()


class RegisterSerializer(serializers.Serializer):
    """Inscription par e-mail + mot de passe.

    Le modèle User par défaut de Django utilise `username` ; on l'aligne sur
    l'e-mail (username = email) pour une connexion par e-mail, sans migrer vers
    un modèle utilisateur personnalisé (trop intrusif sur une base existante)."""

    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        value = value.strip().lower()
        if (
            User.objects.filter(email__iexact=value).exists()
            or User.objects.filter(username__iexact=value).exists()
        ):
            raise serializers.ValidationError("Un compte existe déjà avec cet e-mail.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        name = (validated_data.get("name") or "").strip()
        user = User(username=email, email=email, first_name=name[:150])
        user.set_password(validated_data["password"])
        user.save()
        return user

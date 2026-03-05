import os
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.middleware.csrf import get_token
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import UserProfile


logger = logging.getLogger(__name__)


def user_payload(user: User):
    profile = getattr(user, "profile", None)
    display_name = user.get_full_name().strip() or user.username
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "display_name": display_name,
        "avatar_url": getattr(profile, "avatar_url", None),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    password2 = request.data.get("password2")

    if not username or not email or not password or not password2:
        return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if password != password2:
        return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response(user_payload(user), status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    return Response(user_payload(user), status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login_api(request):
    credential = request.data.get("credential")
    if not credential:
        return Response({"detail": "Missing Google credential."}, status=status.HTTP_400_BAD_REQUEST)

    configured_ids = [cid.strip() for cid in os.getenv("GOOGLE_CLIENT_ID", "").split(",") if cid.strip()]

    try:
        audience = configured_ids if configured_ids else None
        token_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            audience=audience,
            clock_skew_in_seconds=60,
        )
    except Exception as exc:
        logger.warning("Google token verification failed: %s", exc)
        if settings.DEBUG:
            return Response(
                {"detail": f"Invalid Google token: {exc}"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response({"detail": "Invalid Google token."}, status=status.HTTP_401_UNAUTHORIZED)

    aud = token_info.get("aud")
    if configured_ids and aud not in configured_ids:
        return Response({"detail": "Google client is not allowed."}, status=status.HTTP_401_UNAUTHORIZED)

    email = token_info.get("email")
    sub = token_info.get("sub")
    picture = token_info.get("picture")
    full_name = token_info.get("name") or ""
    given_name = token_info.get("given_name") or ""
    family_name = token_info.get("family_name") or ""
    if not email or not sub:
        return Response({"detail": "Google token missing required identity fields."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email=email).first()
    if not user:
        base = email.split("@")[0][:25] or f"google_{sub[:8]}"
        username = base
        idx = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}_{idx}"
            idx += 1
        first_name = given_name
        last_name = family_name
        if not first_name and full_name:
            parts = full_name.strip().split(" ", 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ""
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
    else:
        # Keep existing users in sync with their current Google profile name.
        updated_fields = []
        if given_name and user.first_name != given_name:
            user.first_name = given_name
            updated_fields.append("first_name")
        if family_name and user.last_name != family_name:
            user.last_name = family_name
            updated_fields.append("last_name")
        if updated_fields:
            user.save(update_fields=updated_fields)

    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.google_sub = sub
    profile.avatar_url = picture
    profile.save(update_fields=["google_sub", "avatar_url"])

    login(request, user)
    return Response(user_payload(user), status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_api(request):
    return Response({"csrfToken": get_token(request)}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_api(request):
    return Response(user_payload(request.user), status=status.HTTP_200_OK)

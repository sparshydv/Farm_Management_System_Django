from django.urls import path

from .api_views import csrf_api, google_login_api, login_api, logout_api, me_api, register_api

app_name = "authentication_api"

urlpatterns = [
    path("csrf/", csrf_api, name="csrf"),
    path("google/", google_login_api, name="google-login"),
    path("register/", register_api, name="register"),
    path("login/", login_api, name="login"),
    path("logout/", logout_api, name="logout"),
    path("me/", me_api, name="me"),
]

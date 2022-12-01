from django.urls import include, path
from auth.views import (
    RegisterView,
    DeleteUserView,
    ActivateAccountView,
    ChangePasswordView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("delete/", DeleteUserView.as_view(), name="auth_delete"),
    path("change-password/", ChangePasswordView.as_view(), name="auth_change_password"),
    path(
        "password-reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("activate/<token>/<uidb64>/", ActivateAccountView.as_view(), name="activate"),
]

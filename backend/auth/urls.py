from django.urls import path
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

from .utils.reset_password_request_token import ResetPasswordRequestToken
from django_rest_passwordreset.views import (
    ResetPasswordValidateToken,
    ResetPasswordConfirm,
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
        ResetPasswordRequestToken.as_view(),
        name="auth_password_reset",
    ),
    path(
        "password-reset/validate_token/",
        ResetPasswordValidateToken.as_view(),
        name="auth_password_reset_validate_token",
    ),
    path(
        "password-reset/confirm/",
        ResetPasswordConfirm.as_view(),
        name="auth_password_reset_confirm",
    ),
    path("activate/<token>/<uidb64>/", ActivateAccountView.as_view(), name="activate"),
]

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from auth.urls import urlpatterns as auth_urls


urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("auth.urls")),
    path("user_system/", include("user_system.urls")),
    # path("api-auth/", include("rest_framework.urls")),
    path("api/", include("medical_finding.urls")),
    # path("user/",  include('django.contrib.auth.urls')),
    # path("api2/", include('user_system.urls')),
    path("upload/", include("upload_files.urls")),
    path("download/", include("download_files.urls")),
]

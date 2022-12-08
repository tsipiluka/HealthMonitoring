from django.contrib import admin
from django.urls import path, include


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

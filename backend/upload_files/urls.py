from django.urls import path
from .views import FileUploadView, DeleteUploadedFileView


urlpatterns = [
    path("", FileUploadView.as_view(), name="upload_file"),
    path(
        "delete/<str:medical_finding_id>/",
        DeleteUploadedFileView.as_view(),
        name="delete_file",
    ),
]

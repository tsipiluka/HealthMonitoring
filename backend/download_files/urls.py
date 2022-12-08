from django.urls import path
from .views import FileDownloadView

urlpatterns = [
    path("<str:medical_finding_id>/", FileDownloadView.as_view(), name="download-file")
]

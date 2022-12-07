from django.urls import path
from .views import FileUploadView, DeleteUploadedFileView


urlpatterns = [
    path('', FileUploadView.as_view()),
    path('delete/<str:medical_finding_id>/', DeleteUploadedFileView.as_view())
]
from django.urls import include, path

from .views import ListMedicalFindings, CreateMedicalFinding, MedicalFindingDetail


app_name = "medical_finding"
urlpatterns = [
    path("medical_findings/", ListMedicalFindings.as_view(), name="medical_findings"),
    path(
        "medical_finding/",
        CreateMedicalFinding.as_view(),
        name="create_medical_finding",
    ),
    path(
        "medical_finding/<str:finding_id>/",
        MedicalFindingDetail.as_view(),
        name="medical_finding_detail",
    ),
]

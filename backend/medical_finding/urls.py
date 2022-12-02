from django.urls import include, path

from .views import (
    ListMedicalFindingsPatient,
    ListMedicalFindingsDoctor,
    ListMedicalFindingsReader,
    CreateMedicalFinding,
    UpdateMedicalFinding,
    GetMedicalFinding,
    DeleteMedicalFinding,
)

app_name = "medical_finding"
urlpatterns = [
    path(
        "medical_findings_patient/",
        ListMedicalFindingsPatient.as_view(),
        name="medical_findings_patient",
    ),
    path(
        "medical_findings_doctor/",
        ListMedicalFindingsDoctor.as_view(),
        name="medical_findings_doctor",
    ),
    path(
        "medical_findings_reader/",
        ListMedicalFindingsReader.as_view(),
        name="medical_findings_reader",
    ),
    path(
        "create_medical_finding/",
        CreateMedicalFinding.as_view(),
        name="create_medical_finding",
    ),
    path(
        "update_medical_finding/<str:finding_id>/",
        UpdateMedicalFinding.as_view(),
        name="update_medical_finding",
    ),
    path(
        "get_medical_finding/<str:finding_id>/",
        GetMedicalFinding.as_view(),
        name="get_medical_finding",
    ),
    path(
        "delete_medical_finding/<str:finding_id>/",
        DeleteMedicalFinding.as_view(),
        name="delete_medical_finding",
    ),
]

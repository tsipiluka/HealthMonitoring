from django.urls import include, path

from .views import (
    ListMedicalFindingsPatient,
    ListMedicalFindingsDoctor,
    ListMedicalFindingsReader,
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
]

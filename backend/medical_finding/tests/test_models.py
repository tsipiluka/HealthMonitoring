from django.test import TestCase
from medical_finding.models import (BaseModel, FindingReadingRight,
                                    MedicalFinding)
from medical_finding.serializer import MedicalFindingSerializer
from user_system.models import Doctor, Patient, User
from user_system.tests.test_models import TestUserModel


class TestMedicalFinding(TestCase):

    def test_create_medical_finding(self, patient=None, doctor=None):
        """
        Test if medical findings can be created.
        """
        if patient is None:
            patient = TestUserModel().test_patient()
        if doctor is None:
            doctor = TestUserModel().test_doctor()


        medical_finding = MedicalFinding.objects.create(
            treator=doctor,
            patient=patient,
            disease="Disease",
            medicine="Medicine",
        )

        self.assertEqual(medical_finding.disease, "Disease")
        self.assertEqual(medical_finding.medicine, "Medicine")
        self.assertEqual(medical_finding.patient, patient)
        self.assertEqual(medical_finding.treator, doctor)

        return medical_finding

    def test_create_finding_reading_right(self):
        """
        Test if medical finding reading rights can be created.

        """
        doctor = TestUserModel().test_doctor()
        patient = TestUserModel().test_patient()
        medical_finding = MedicalFinding.objects.create(
            treator=doctor,
            patient=patient,
            disease="Disease",
            medicine="Medicine",
        )
        patient2 = TestUserModel().test_patient(email="patient2@test.de")
        finding_reading_right = FindingReadingRight.objects.create(
            medical_finding=medical_finding, reader=patient2
        )

        self.assertEqual(finding_reading_right.medical_finding, medical_finding)
        self.assertEqual(finding_reading_right.reader, patient2)
        

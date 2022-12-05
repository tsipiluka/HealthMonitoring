from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user_system.models import User, Doctor, Patient
from rest_framework.test import force_authenticate, APIRequestFactory
from rest_framework_simplejwt.tokens import RefreshToken
from django.test.client import encode_multipart, RequestFactory
from user_system.tests.test_models import TestUserModel

class TestListMedicalFindingViews(APITestCase):

    def test_medical_findings_patient(self):
        """
        Test if medical findings can be retrieved for a patient.
        Expected: 200 OK
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.get(reverse('medical_finding:medical_findings_patient'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_medical_findings_doctor(self):
        """
        Test if medical findings can be retrieved for a doctor.
        Expected: 200 OK
        """
        user = TestUserModel().test_doctor()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.get(reverse('medical_finding:medical_findings_doctor'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_medical_findings_patient_as_doc(self):
        """
        Test if medical findings for patients can be retrieved 
        for a doctor. Expected: 400 BAD REQUEST since the doctor
        doesn't have personal medical findings.
        """
        user = TestUserModel().test_doctor()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.get(reverse('medical_finding:medical_findings_patient'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_medical_findings_doctor_as_patient(self):
        """
        Test if medical findings for doctors can be retrieved
        for a patient. Expected: 400 BAD REQUEST since the patient
        doesn't have medical findings for doctors.
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.get(reverse('medical_finding:medical_findings_doctor'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
class TestCreateMedicalFindingViews(APITestCase):

    def test_create_medical_finding_patient(self):
        """
        Test if medical findings can be created.
        Expected: 201 CREATED
        """
        patient = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(patient)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.post(reverse('medical_finding:create_medical_finding'), {
            "patient": patient.id,
            "disease": "Disease",
            "medicine": "Medicine",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_medical_finding_doctor(self):
        """
        Test if medical findings can be created with a doctor account.
        Expected is unauthorized since only patients can create medical findings.
        Expected: 401 UNAUTHORIZED
        """
        doctor = TestUserModel().test_doctor()
        refresh = RefreshToken.for_user(doctor)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.post(reverse('medical_finding:create_medical_finding'), {
            "patient": doctor.id,
            "disease": "Disease",
            "medicine": "Medicine",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_medical_finding_for_patient(self):
        """
        Test if medical findings can be created for other patients.
        Expected is unauthorized since only patients can create medical findings
        for themselves.
        """
        patient1 = TestUserModel().test_patient(email="patient1@test.de")
        patient2 = TestUserModel().test_patient(email="patient2@test.de")
        refresh = RefreshToken.for_user(patient1)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.post(reverse('medical_finding:create_medical_finding'), {
            "patient": patient2.id,
            "disease": "Disease",
            "medicine": "Medicine",
        })
        #check if patient1 is the owner of the medical finding and not patient2
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # check if patient1 is the owner of the medical finding and not patient2
        self.assertEqual(response.data['patient']['id'], patient1.id)

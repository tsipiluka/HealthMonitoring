import os
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from user_system.tests.test_models import TestUserModel
from medical_finding.tests.test_models import TestMedicalFinding
from upload_files.models import File
from upload_files.tests.test_models import TestFileModel


class TestFileDownload(APITestCase):

    def test_download_file(self):
        """
        Test if a file can be downloaded.
        Expected: 200 OK
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        file = TestFileModel().test_create_file(patient=user)
        medical_finding = file.medical_finding.uid
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': medical_finding}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_download_file_other_patient(self):
        """
        Test if a file can be downloaded by another patient.
        Expected: 403 Forbidden
        """
        user = TestUserModel().test_patient(email="patient1@test.de")
        refresh = RefreshToken.for_user(user)
        file = TestFileModel().test_create_file()
        medical_finding = file.medical_finding.uid
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': medical_finding}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_download_file_doctor(self):
        """
        Test if a file can be downloaded by a doctor if he 
        is assigned as the treating doctor in the medical finding
        which is the parent object of the file.
        Expected: 200 OK
        """
        doctor = TestUserModel().test_doctor(email="doctor1@test.de")
        refresh = RefreshToken.for_user(doctor)
        file = TestFileModel().test_create_file(doctor=doctor)
        medical_finding = file.medical_finding.uid
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': medical_finding}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_download_file_not_assigned_doctor(self):
        """
        Test if a file can be downloaded by a doctor if he 
        is not assigned as the treating doctor in the medical finding
        which is the parent object of the file.
        Expected: 403 Forbidden
        """
        doctor = TestUserModel().test_doctor(email="doctor1@test.de")
        refresh = RefreshToken.for_user(doctor)
        file = TestFileModel().test_create_file()
        medical_finding = file.medical_finding.uid
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': medical_finding}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_download_invalid_medical_finding_id(self):
        """
        Test if a file can be downloaded with an invalid medical finding id.
        Expected: 400 Bad Request
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': "invalid"}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_download_valid_random_medical_finding_id(self):
        """
        Test if a file can be downloaded with a valid but random
        medical finding id which doesnt exist in the database.
        Expected: 400 Bad Request
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(reverse('download-file', kwargs={'medical_finding_id': "00000000-0000-0000-0000-000000000000"}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

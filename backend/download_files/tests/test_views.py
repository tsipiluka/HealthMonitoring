import os
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from user_system.tests.test_models import TestUserModel
from medical_finding.tests.test_models import TestMedicalFinding


class TestFileDownload(APITestCase):

    def test_download_file(self):
        """
        Test if a file can be downloaded.
        Expected: 200 OK
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        medical_finding = TestMedicalFinding().test_create_medical_finding(patient=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        file_path = os.path.join(os.path.dirname(__file__), "upload_files", "test.txt")
        # with file open
        with open(file_path, "rb") as file:
            response = self.client.post(
                reverse("upload_file"),
                {"file": file,
                 "medical_finding": medical_finding.uid
                 },

                format="multipart",
            )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(
            reverse("download_file", kwargs={"uid": medical_finding.uid})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_download_file_no_finding(self):
        """
        Test if a file can be downloaded without a medical finding.
        Expected: 400 BAD REQUEST
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        file_path = os.path.join(os.path.dirname(__file__), "upload_files", "test.txt")
        # with file open
        with open(file_path, "rb") as file:
            response = self.client.post(
                reverse("upload_file"),
                {"file": file
                 },

                format="multipart",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.get(
            reverse("download_file", kwargs={"uid": "invalid"})
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_download_file_invalid_finding(self):
        """
        Test if a file can be downloaded with an invalid medical finding.
        Expected: 400 BAD REQUEST
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        file_path = os.path.join(os.path.dirname(__file__), "upload_files", "test.txt")
        # with file open
        with open(file_path
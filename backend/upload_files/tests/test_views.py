import os
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from user_system.tests.test_models import TestUserModel
from medical_finding.tests.test_models import TestMedicalFinding


class TestFileUpload(APITestCase):

    def test_upload_file(self):
        """
        Test if a file can be uploaded.
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
        
    def test_upload_file_no_finding(self):
        """
        Test if a file can be uploaded without a medical finding.
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

    def test_upload_file_invalid_finding(self):
        """
        Test if a file can be uploaded with an invalid medical finding.
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
                {"file": file, 
                "medical_finding": "invalid"
                },

                format="multipart",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_upload_file_valid_uid(self):
        """
        Test if a file can be uploaded with a valid random medical 
        finding uid that does not exist.
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
                {"file": file, 
                "medical_finding": "e0a7f2c0-8a2b-4f1d-8e95-6a8a7b4a6e2f"
                },

                format="multipart",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_file_no_file(self):
        """
        Test if a file can be uploaded without a file.
        Expected: 400 BAD REQUEST
        """
        user = TestUserModel().test_patient()
        refresh = RefreshToken.for_user(user)
        medical_finding = TestMedicalFinding().test_create_medical_finding(patient=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.post(
            reverse("upload_file"),
            {"medical_finding": medical_finding.uid
            },

            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_upload_file_no_finding_access(self):
        """
        Test if a file can be uploaded without access to the medical finding.
        Expected: 400 BAD REQUEST
        """
        user = TestUserModel().test_patient()
        medical_finding = TestMedicalFinding().test_create_medical_finding(patient=user)
        user2 = TestUserModel().test_patient(email="patient2@test.de")
        refresh2 = RefreshToken.for_user(user2)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh2.access_token}")
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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

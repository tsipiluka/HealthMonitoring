
from user_system.models import User, Doctor, Patient, DoctorProfile, PatientProfile

from rest_framework.test import APIClient, APITestCase


class TestUserModel(APITestCase):

    def test_patient(self, email="patient@test.de"):
        user = User.objects.create_user(
            email=email,
            first_name="test",
            last_name="test",
            role = User.Role.PATIENT,
        )
        user.set_password("test")
        # set is_active to true
        user.is_active = True
        user.save()
        return user

    def test_doctor(self, email="doctor@test.de"):
        user = User.objects.create_user(
            email=email,
            first_name="test",
            last_name="test",
            role = User.Role.DOCTOR,
        )
        user.set_password("test")
        user.is_active = True
        user.save()
        return user

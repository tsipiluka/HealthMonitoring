from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user_system.models import User, Doctor, Patient, PatientProfile
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


class TestRegisterView(APITestCase):

    def test_register(self):
        """
        Ensure we can register a new user object. Reverse checks if the url
        is correct. Makes an API call to the register endpoint. Checks if 
        the response is 201. Then checks if the user is in the database.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_register_password_not_match(self):
        """
        Checks if the user gets created if the passwords don't match.
        Ther expected response is 400 since the passwords don't match.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword1234!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_password_policy(self):
        """
        Checks if the user gets created if the password doesn't match the
        password policy. The expected response is 400 since the password
        doesn't match the policy.
        """
        data = {
            "email": "test@test.de",
            "password": "test",
            "password2": "test",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_email_already_exists(self):
        """
        Checks if the user gets created if the email already exists.
        The expected response is 400 since the email already exists.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_register_role_admin(self):
        """
        Checks if the user gets created if the role is admin.
        The expected response is 400 since privileged accounts
        can't be created using the register endpoint.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
            "role": User.Role.ADMIN,
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_role_doctor(self):
        """
        Checks if the user gets created if the role is doctor.
        The expected response is 400 since privileged accounts
        can't be created using the register endpoint.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
            "role": User.Role.DOCTOR,
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_role_patient(self):
        """
        Checks if the user gets created if the role is patient.
        The expected response is 201 since the user gets created.
        Also checks if the belonging PatientProfile gets created.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)

    def test_user_inactive(self):
        """
        Checks if the user gets created if the user is inactive.
        It should be inactive by default since it is not verified+
        if the user didn't verify his email address.
        """
        data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)
        self.assertEqual(User.objects.get().is_active, False)

class TestLoginView(APITestCase):
    
    def test_login(self):
        """
        Checks if the user gets logged in if the credentials are correct.
        With an inactive user the expected response is 401 since the user
        is not verified. With an active user the expected response is 200.
        """
        register_data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01",
        }
        response = self.client.post(reverse("auth_register"), register_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"],
        }
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # set the is_active flag to true
        user = User.objects.get()
        user.is_active = True
        user.save()
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestDeleteUser(APITestCase):

    def test_delete_user(self):
        """
        Checks if the user gets deleted if the user is authenticated.
        The expected response is 204 since the user gets deleted.
        """
        register_data = {
            "email": "test@test.de",
            "password": "MySecretPassword123!",
            "password2": "MySecretPassword123!",
            "first_name": "Test",
            "last_name": "Test",
            "birth_date": "1990-01-01"
        }
        response = self.client.post(reverse("auth_register"), register_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)
        # set is_active to true
        user = User.objects.get()
        user.is_active = True
        user.save()
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"],
        }
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.delete(reverse("auth_delete"))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(PatientProfile.objects.count(), 0)

class TestPasswordChange(APITestCase):

    def test_password_change(self):
        """
        Checks if the password gets changed if the user is authenticated.
        The expected response is 204 since the password gets changed.
        """
        user = User.objects.create_user(
            email="test@test.de",
            first_name="Test",
            last_name="Test",
            birth_date="1990-01-01",
        )
        user.set_password("MySecretPassword123!")
        user.is_active = True
        user.save()

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)

        login_data = {
            "email": user.email,
            "password": "MySecretPassword123!"
        }
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        data = {
            "old_password": "MySecretPassword123!",
            "new_password": "MyNewSecretPassword1337!",
            "new_password2": "MyNewSecretPassword1337!",
        }
        response = self.client.put(reverse("auth_change_password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_change_no_match(self):
        """
        Checks if the password gets changed if the user is authenticated.
        The expected response is 400 since the new passwords do not match.
        """
        user = User.objects.create_user(
            email="test@test.de",
            first_name="Test",
            last_name="Test",
            birth_date="1990-01-01",
        )
        user.set_password("MySecretPassword123!")
        user.is_active = True
        user.save()

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)

        login_data = {
            "email": user.email,
            "password": "MySecretPassword123!"
        }
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        data = {
            "old_password": "MySecretPassword123!",
            "new_password": "MyNewSecretPassword13378",
            "new_password2": "MyNewSecretPassword1337!",
        }
        response = self.client.put(reverse("auth_change_password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_password_change_old_password(self):
        """
        Checks if the password gets changed if the user is authenticated.
        If the old password is wrong, the expected response is 400.
        If the old password is not provided, the expected response is 400.
        """
        user = User.objects.create_user(
            email="test@test.de",
            first_name="Test",
            last_name="Test",
            birth_date="1990-01-01",
        )
        user.set_password("MySecretPassword123!")
        user.is_active = True
        user.save()

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(PatientProfile.objects.count(), 1)

        login_data = {
            "email": user.email,
            "password": "MySecretPassword123!"
        }
        response = self.client.post(reverse("token_obtain_pair"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        data = {
            "new_password": "MyNewSecretPassword13378",
            "new_password2": "MyNewSecretPassword1337!",
        }
        response = self.client.put(reverse("auth_change_password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "old_password" : "WrongPassword",
            "new_password": "MyNewSecretPassword13378",
            "new_password2": "MyNewSecretPassword1337!",
        }

        response = self.client.put(reverse("auth_change_password"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

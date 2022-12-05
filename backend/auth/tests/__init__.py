from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

import pytest


@pytest.fixture
def api_client():
    user = User.objects.create_user(username='john', email='js@js.com', password='js.sj')
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    return client
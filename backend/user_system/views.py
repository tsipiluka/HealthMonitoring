from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from .seralizers import PatientProfileSerializer
from .models import Patient
from django.contrib.auth.decorators import permission_required
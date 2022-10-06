from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from HealthDashboard.models import Person, Patient, Arzt, Befund, PatientenZugriff, ArztZugriff
from HealthDashboard.serializers import PersonSerializer, PatientSerializer, ArztSerializer, BefundSerializer, PatientenZugriffSerializer, ArztZugriffSerializer 

# Create your views here.


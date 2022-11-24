from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from .seralizers import PatientProfileSerializer
from .models import Patient
from django.contrib.auth.decorators import permission_required


class PatientProfile(APIView):

    @permission_required('user_system.view_patient')
    def get(self, request):
        user = request.user
        patient_profile = Patient.objects.get(user=user)
        serializer = PatientProfileSerializer(patient_profile)
        return Response(serializer.data)

class TestHello2(APIView):
    
    def get(self, request):
        # return a simple response
        
        return Response("Hello World")

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from .seralizers import PatientSerializer, DoctorSerializer, UserSerializer
from .models import Doctor, Patient, User
from django.contrib.auth.decorators import permission_required

class UserProfileView(APIView):
    # authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        if user.role == User.Role.PATIENT:
            patient = Patient.objects.get(pk=user.pk)
            serializer = PatientSerializer(patient.patient_profile)
            return Response(serializer.data)
        elif user.role == User.Role.DOCTOR:
            doctor = Doctor.objects.get(pk=user.pk)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)
        else:
            user = User.objects.get(pk=user.pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
            

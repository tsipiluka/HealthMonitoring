from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from .seralizers import PatientProfileSerializer, UserSerializer, DoctorSerializer, PatientSerializer, DoctorProfileSerializer
from .models import Doctor, Patient, User
from django.contrib.auth.decorators import permission_required

class UserProfileView(APIView):
    # authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        if user.is_patient:
            patient = Patient.objects.get(id=user.id)
            serializer = PatientSerializer(patient)

            # also return the patient profile
            patient_profile = patient.patient_profile
            patient_profile_serializer = PatientProfileSerializer(patient_profile)
            return Response({
                'user': serializer.data,
                'patient_profile': patient_profile_serializer.data
            })

        elif user.is_doctor:
            doctor = Doctor.objects.get(id=user.id)
            serializer = DoctorSerializer(doctor)

            # also return the doctor profile
            doctor_profile = doctor.doctor_profile
            doctor_profile_serializer = DoctorProfileSerializer(doctor_profile)
            return Response({
                'user': serializer.data,
                'doctor_profile': doctor_profile_serializer.data
            })
            
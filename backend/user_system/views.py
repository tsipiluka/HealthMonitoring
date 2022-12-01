from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from .seralizers import PatientProfileSerializer, UserSerializer, LightUserSerializer, DoctorProfileSerializer
from .models import Doctor, Patient, User, PatientProfile, DoctorProfile
from django.contrib.auth.decorators import permission_required
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get the user profile consisting of the user object and the profile object.
        """
    def get(self, request):
        """
        Get the user profile consisting of the user object and the profile object.
        """
        user = request.user
        serializer = LightUserSerializer(user)
        if user.is_doctor():
            try:
                doctor_profile = DoctorProfile.objects.get(user_id=user.id)
                profile_serializer = DoctorProfileSerializer(doctor_profile)
            except DoctorProfile.DoesNotExist:
                return Response({"No profile found"}, status=status.HTTP_404_NOT_FOUND)
        elif user.is_patient():
            try:
                patient_profile = PatientProfile.objects.get(user_id=user.id)
                profile_serializer = PatientProfileSerializer(patient_profile)
            except PatientProfile.DoesNotExist:
                return Response({"No profile found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        data = {**serializer.data, **profile_serializer.data}
        return Response(data, status=status.HTTP_200_OK)
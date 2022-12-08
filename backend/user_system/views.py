from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .seralizers import (
    PatientProfileSerializer,
    LightUserSerializer,
    DoctorProfileSerializer,
    UserIDSerializer,
)
from .models import PatientProfile, DoctorProfile
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


class GetUserByProfiledID(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Get the user profile consisting of the user object and the profile object.
        """

        # get the profile_id from request body
        try:
            profile_id = request.data["profile_id"]
        except KeyError:
            return Response(
                {"profile_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        # get the profile object of the profile_id
        try:
            profile = DoctorProfile.objects.get(doctor_id=profile_id)
            user = profile.user
        except DoctorProfile.DoesNotExist:
            try:
                profile = PatientProfile.objects.get(patient_id=profile_id)
                user = profile.user
            except PatientProfile.DoesNotExist:
                return Response({"No profile found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserIDSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

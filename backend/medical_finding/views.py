from django.http import Http404
from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework.response import Response
from .models import MedicalFinding, FindingAccessRight
from .serializer import (
    MedicalFindingSerializer,
    FindingAccessRightSerializer,
    UpdateMedicalFindingSerializer,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user_system.models import Patient, Doctor, User


class ListMedicalFindings(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_patient():
            medical_findings = MedicalFinding.objects.filter(user=user)
            print("is patient")
        elif user.is_doctor():
            medical_findings = MedicalFinding.objects.filter(diagnosed_by=user)
            print("is doctor")
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = MedicalFindingSerializer(medical_findings, many=True)
        # return the user obj instead of the id
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateMedicalFinding(APIView):
    """
    Create a medical finding. Only doctors can create medical findings.
    Medical findings can only be created for patients.

    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_patient():
            # forbid to create medical findings
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_doctor():
            serializer = MedicalFindingSerializer(data=request.data)
            # set diagnosed_by to the current user
            if serializer.is_valid():
                serializer.save(diagnosed_by=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalFindingDetail(APIView):
    """
    Get, update or delete a medical finding.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(pk=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def get(self, request, finding_id, format=None):
        """
        Get a medical finding. Only the patient or the
        doctor who diagnozed the finding can access it.
        """

        user = request.user
        medical_finding = self.get_object(finding_id)
        serializer = MedicalFindingSerializer(medical_finding)
        # check if the user is allowed to access the medical finding
        if user.is_patient():
            if medical_finding.patient == user:
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_doctor():
            if medical_finding.diagnosed_by == user:
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.data)

    def put(self, request, finding_id, format=None):
        """
        Update a medical finding. Only the doctor who diagnozed the
        finding can update it. Neither the patient nor the doctor
        can be changed. Either medicine or disease must be provided.
        """

        user = request.user
        medical_finding = self.get_object(finding_id)

        if user.is_doctor():
            if medical_finding.diagnosed_by == user:
                serializer = UpdateMedicalFindingSerializer(
                    medical_finding, data=request.data
                )
                # make
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, finding_id, format=None):
        medical_finding = self.get_object(finding_id)

        # only the doctor who diagnozed the finding or the patient can delete it
        if (
            request.user == medical_finding.diagnosed_by
            or request.user == medical_finding.patient
        ):
            medical_finding.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class FindingAccesRightView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # findingAccessRights where user is initiator or receiver
        findingAccessRights = FindingAccessRight.objects.filter(
            initiator=user
        ) | FindingAccessRight.objects.filter(receiver=user)
        serializer = FindingAccessRightSerializer(findingAccessRights, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EditAccessRightView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        # check if user is doctor
        if not user.is_doctor:
            return Response(
                {"Only doctors can edit access rights"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            # check serializer validity
            serializer = FindingAccessRightSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {
                        "status": False,
                        "message": "invalid fields",
                        "data": serializer.errors,
                    }
                )
            request.data["initiator"] = user.id
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

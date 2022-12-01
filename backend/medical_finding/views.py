from django.http import Http404
from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework.response import Response
from .models import MedicalFinding, FindingReadingRight
from .serializer import (
    MedicalFindingSerializer,
    UpdateMedicalFindingSerializer,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user_system.models import Patient, Doctor


class ListMedicalFindingsPatient(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            medical_findings = MedicalFinding.objects.filter(patient=patient)
        elif user.is_doctor():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = MedicalFindingSerializer(medical_findings, many=True)
        # return the user obj instead of the id
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListMedicalFindingsDoctor(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            medical_findings = MedicalFinding.objects.filter(treator=doctor)
        elif user.is_patient():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = MedicalFindingSerializer(medical_findings, many=True)
        # return the user obj instead of the id
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListMedicalFindingsReader(APIView):
    """
    Returns the medical findings that the user has the right to read.
    The user can either be a doctor or a patient.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # get all the reading rights of the user
        reading_rights = FindingReadingRight.objects.filter(reader=user)
        medical_findings = []
        for reading_right in reading_rights:
            medical_findings.append(reading_right.medical_finding)
        serializer = MedicalFindingSerializer(medical_findings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateMedicalFinding(APIView):

    """
    Create a medical finding. Only the patient can 
    create a medical finding for himself.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            serializer = MedicalFindingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(patient=patient)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

class UpdateMedicalFinding(APIView):

    """
    Update a medical finding. Only the assigned treator 
    and the patient can update the medical finding.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404
    
    def put(self, request, finding_id):
        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            if doctor == medical_finding.treator:
                serializer = UpdateMedicalFindingSerializer(medical_finding, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                serializer = UpdateMedicalFindingSerializer(medical_finding, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
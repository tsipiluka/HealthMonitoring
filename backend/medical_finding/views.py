import os
import uuid
from django.http import Http404
from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework.response import Response

from core import settings
from .models import MedicalFinding, FindingReadingRight
from .serializer import (
    MedicalFindingSerializer,
    UpdateMedicalFindingSerializer,
    ReadingRightSerializer,
    AddReadingRightSerializer,
    CreateMedicalFindingSerializer
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user_system.models import Patient, Doctor
from uuid import UUID
from upload_files.models import File


def is_valid_uuid(uuid_to_test, version=4):

    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test


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
            serializer = CreateMedicalFindingSerializer(data=request.data)
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

        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            if doctor == medical_finding.treator:
                serializer = UpdateMedicalFindingSerializer(
                    medical_finding, data=request.data
                )
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                serializer = UpdateMedicalFindingSerializer(
                    medical_finding, data=request.data
                )
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class GetMedicalFinding(APIView):

    """
    Get a medical finding. Only the assigned treator
    and the patient can get the medical finding.
    Also, the user can get the medical finding if he has
    the right to read it.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):

        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def get(self, request, finding_id):

        # check if the finding id is valid uuid
        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            if doctor == medical_finding.treator:
                serializer = MedicalFindingSerializer(medical_finding)
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                serializer = MedicalFindingSerializer(medical_finding)
                return Response(serializer.data, status=status.HTTP_200_OK)
        if user.is_patient() or user.is_doctor():
            reading_rights = FindingReadingRight.objects.filter(reader=user)
            for reading_right in reading_rights:
                if reading_right.medical_finding == medical_finding:
                    serializer = MedicalFindingSerializer(medical_finding)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class DeleteMedicalFinding(APIView):

    """
    Delete a medical finding. Only the patient can
    delete the medical finding. Also deletes the
    belonging file if it exists.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def delete(self, request, finding_id):

        # check if the finding id is valid uuid
        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                medical_finding.delete()
                # delete the belonging file if it exists
                f = File.objects.filter(medical_finding=medical_finding).first()
                if f:
                    os.remove(os.path.join(settings.MEDIA_ROOT, f.file.name))
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class GetReadingRights(APIView):

    """
    Get all the reading rights of a medical finding.
    Only the patient and the assigned treator can
    get the reading rights.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def get(self, request, finding_id):

        # check if the finding id is valid uuid
        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            if doctor == medical_finding.treator:
                reading_rights = FindingReadingRight.objects.filter(
                    medical_finding=medical_finding
                )
                serializer = ReadingRightSerializer(reading_rights, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                reading_rights = FindingReadingRight.objects.filter(
                    medical_finding=medical_finding
                )
                serializer = ReadingRightSerializer(reading_rights, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)



class AddReadingRight(APIView):

    """
    Add a reading right to a medical finding.
    Only the patient and the assigned treator can
    add a reading right.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def post(self, request, finding_id):

        # check if the finding id is valid uuid
        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)

        # check if the user is the same as reader
        if user.pk == request.data["reader"]:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if user.is_doctor():
            doctor = Doctor.objects.get(id=user.pk)
            if doctor == medical_finding.treator:
                serializer = AddReadingRightSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(medical_finding=medical_finding)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                serializer = AddReadingRightSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(medical_finding=medical_finding)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class DeleteReadingRight(APIView):

    """
    Delete a reading right of a medical finding.
    Only the patient can delete a reading right.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, finding_id):
        try:
            return MedicalFinding.objects.get(uid=finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def delete(self, request, finding_id, reader_id):

        # check if the finding id is valid uuid
        if not is_valid_uuid(finding_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        medical_finding = self.get_object(finding_id)
        if user.is_patient():
            patient = Patient.objects.get(id=user.pk)
            if patient == medical_finding.patient:
                reading_right = FindingReadingRight.objects.get(
                    medical_finding=medical_finding, reader=reader_id
                )
                reading_right.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

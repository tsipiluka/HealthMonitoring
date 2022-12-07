import os
import uuid
from django.conf import settings
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from medical_finding.models import MedicalFinding
from upload_files.models import File
from .serializers import FileSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated


class FileUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

        file_serializer = FileSerializer(data=request.data)

        if not request.data.get('medical_finding'):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        medical_finding_id = request.data.get('medical_finding')

        try:
            medical_finding_id = uuid.UUID(medical_finding_id, version=4)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            medical_finding = MedicalFinding.objects.get(uid=medical_finding_id)
        except MedicalFinding.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        if not (request.user == medical_finding.patient or request.user == medical_finding.treator):
            return Response(status=status.HTTP_403_FORBIDDEN)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUploadedFileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, medical_finding_id, *args, **kwargs):

        medical_finding = MedicalFinding.objects.filter(uid=medical_finding_id).first()

        if not (request.user == medical_finding.patient or request.user == medical_finding.treator):
        
            return Response(status=status.HTTP_403_FORBIDDEN)

        f = File.objects.filter(medical_finding=medical_finding_id).first()
        if not f:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            os.remove(os.path.join(settings.MEDIA_ROOT, f.file.name))
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        f.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
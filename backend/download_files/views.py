import base64
import os
from django.http import Http404, HttpResponse
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from download_files.serializers import FileDownloadSerializer
from upload_files.models import File
from rest_framework import generics
from django.http import HttpResponse
from wsgiref.util import FileWrapper
from encrypted_files.base import EncryptedFile
from rest_framework.response import Response
from .utils.media_types import get_media_type

class FileDownloadView(APIView):
    permission_classes = []
    def get(self, request, medical_finding_id, *args, **kwargs):
        """
        Returns a decrypted file from the server
        if the file is not found, returns a 404
        """
        # check if the medical_finding exists
        f = File.objects.filter(medical_finding=medical_finding_id).first()
        if not f:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            ef = EncryptedFile(f.file)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return HttpResponse(ef.read(), content_type=get_media_type(f.file.name)) 

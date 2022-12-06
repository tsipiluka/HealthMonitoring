import os
from django.conf import settings
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from upload_files.models import File
from .serializers import FileSerializer


class FileUploadView(APIView):
    parser_class = (FileUploadParser,)
    permission_classes = []
    def post(self, request, *args, **kwargs):

      file_serializer = FileSerializer(data=request.data)

      if file_serializer.is_valid():
          file_serializer.save()
          return Response(file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUploadedFileView(APIView):
    permission_classes = []
    def delete(self, request, medical_finding_id, *args, **kwargs):
        # check if the medical_finding exists
        f = File.objects.filter(medical_finding=medical_finding_id).first()
        if not f:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            os.remove(os.path.join(settings.MEDIA_ROOT, f.file.name))
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        f.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
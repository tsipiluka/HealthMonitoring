from django.http import Http404, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from medical_finding.models import FindingReadingRight
from medical_finding.models import MedicalFinding
from upload_files.models import File
from django.http import HttpResponse
from encrypted_files.base import EncryptedFile
from rest_framework.response import Response
from download_files.utils.media_types import get_media_type
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from uuid import UUID


def is_valid_uuid(uuid_to_test, version=4):

    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test

class FileDownloadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, medical_finding_id):

        try:
            return MedicalFinding.objects.get(uid=medical_finding_id)
        except MedicalFinding.DoesNotExist:
            raise Http404

    def get(self, request, medical_finding_id, *args, **kwargs):
        """
        Returns a decrypted file from the server
        if the file is not found, returns a 404
        """
        # # str to uuid
        # if not is_valid_uuid(medical_finding_id):
        #     return Response(status=status.HTTP_400_BAD_REQUEST)

        print("Medical finding id: " + medical_finding_id)
        # remove "" from string
        medical_finding_id = medical_finding_id[1:-1]

        # medical_finding = MedicalFinding.objects.get(pk=medical_finding_id)
        #print("Medical finding: " + medical_finding)

        
        # if not medical_finding:
        #     print("Medical finding is none")
        #     return Response(status=status.HTTP_404_NOT_FOUND)

        # if not (request.user == medical_finding.patient or request.user == medical_finding.treator):
        #     if not FindingReadingRight.objects.filter(medical_finding=medical_finding, reader=request.user).exists():
        #         return Response(status=status.HTTP_403_FORBIDDEN)




        # f = File.objects.filter(medical_finding=medical_finding_id).first()
        # if not f:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        # try:
        #     ef = EncryptedFile(f.file)
        # except:
        #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # return HttpResponse(ef.read(), content_type=get_media_type(f.file.name))
        return Response(status=status.HTTP_200_OK)

import os
from django.test import TestCase
from upload_files.models import File
from django.core.files.uploadedfile import SimpleUploadedFile
from medical_finding.tests.test_models import TestMedicalFinding

class TestFileModel(TestCase):
    
    def test_create_file(self, patient=None, doctor=None):

        if patient is not None:
            finding = TestMedicalFinding().test_create_medical_finding(patient=patient)
        else:
            finding = TestMedicalFinding().test_create_medical_finding()
        
        if doctor is not None:
            finding.treator = doctor
            finding.save()

        file_path = os.path.join(os.path.dirname(__file__), "upload_files", "test.txt")
        file_data = SimpleUploadedFile(
            file_path, b"file_content", content_type="text/plain"
        )

        file = File.objects.create(
            file=file_data,
            medical_finding=finding,
        )
        
        self.assertEqual(file.medical_finding, finding)
        return file

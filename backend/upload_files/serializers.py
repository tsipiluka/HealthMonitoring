from rest_framework import serializers
from .models import File
from medical_finding.models import MedicalFinding
class FileSerializer(serializers.ModelSerializer):

    file_name = serializers.CharField(source='file.name', read_only=True)
    # require medical_finding
    medical_finding = serializers.PrimaryKeyRelatedField(queryset=MedicalFinding.objects.all(), required=True)
    class Meta:
        model = File
        fields = "__all__"

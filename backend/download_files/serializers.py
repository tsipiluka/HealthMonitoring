from rest_framework import serializers
from .models import DownloadFile


class FileDownloadSerializer(serializers.ModelSerializer):

    # medical_finding primary key
    medical_finding = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DownloadFile
        fields = ("medical_finding",)

from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):

    file_name = serializers.CharField(source='file.name', read_only=True)
    class Meta:
        model = File
        fields = "__all__"

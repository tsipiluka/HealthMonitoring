from rest_framework import serializers
from user_system.models import Doctor, Patient, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("__all__")

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Patient
        fields = ("__all__")

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = ("__all__")
from rest_framework import serializers
from user_system.models import PatientProfile, DoctorProfile
from user_system.models import Doctor, Patient, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'birth_date', 'is_doctor', 'is_patient', 'is_email_verified')

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('id', 'email', 'first_name', 'last_name', 'birth_date', 'is_doctor', 'is_patient')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'email', 'first_name', 'last_name', 'birth_date')

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ('patient_id',)

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ('doctor_id',)

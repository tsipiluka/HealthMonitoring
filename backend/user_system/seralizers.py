from rest_framework import serializers

class PatientProfileSerializer (serializers.Serializer):
    user = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    patient_id = serializers.CharField()
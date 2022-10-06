from rest_framework import serializers
from HealthDashboard.models import Person, Patient, Arzt, Befund, PatientenZugriff, ArztZugriff

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('peID', 'vorname', 'nachname')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('paID', 'peID')

class ArztSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arzt
        fields = ('aID', 'bezeichnung', 'peID')
    
class BefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Befund
        fields = ('bID', 'krankheit', 'medikament', 'paID')

class PatientenZugriffSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientenZugriff
        fields = ('paID', 'bID')

class ArztZugriffSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArztZugriff
        fields = ('aID', 'BID')
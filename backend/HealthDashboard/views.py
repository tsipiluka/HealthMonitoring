from wsgiref.util import request_uri
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from HealthDashboard.models import Person, Patient, Arzt, Befund, PatientenZugriff, ArztZugriff
from HealthDashboard.serializers import PersonSerializer, PatientSerializer, ArztSerializer, BefundSerializer, PatientenZugriffSerializer, ArztZugriffSerializer 

# Create your views here.

# APIS
@csrf_exempt
# Person API
def personApi(request,id=0):
    if request.method=='GET':
        person = Person.objects.all()
        person_serializer = PersonSerializer(person, many=True)
        return JsonResponse(person_serializer.data, safe=False)

    elif request.method=='POST':
        person_data = JSONParser().parse(request)
        person_serializer = PersonSerializer(data=person_data)
        if person_serializer.is_valid():
            person_serializer.save()
            return JsonResponse("Added person", safe=False)
        return JsonResponse("Failed to add person", safe=False)

    elif request.method=='PUT':
        person_data = JSONParser().parse(request)
        person=Person.objects.get(peID=person_data['peID'])
        person_serializer=PersonSerializer(person,data=person_data)
        if person_serializer.is_valid():
            return JsonResponse("Changed person", safe=False)
        return JsonResponse("Failed to change person", safe=False)
        
    elif request.method=='DELETE':
        person = Person.objects.get(peID=id)
        person.delete()
        return JsonResponse("Deleted person", safe=False)

# Patient API
def patientAPI(request, id=0):
    if request.method=='GET':
        patient = Patient.objects.all()
        patient_serializer = PatientSerializer(patient, many=True)
        return JsonResponse(patient_serializer.data, safe=False)

    elif request.method=='POST':
        patient_data = JSONParser().parse(request)
        patient_serializer = PatientSerializer(data=patient_data)
        if patient_serializer.is_valid():
            patient_serializer.save()
            return JsonResponse("Added patient", safe=False)
        return JsonResponse("Failed to add patient", safe=False)

    elif request.method=='PUT':
        patient_data = JSONParser().parse(request)
        patient=Patient.objects.get(peID=patient_data['peID'])
        patient_serializer=PatientSerializer(patient,data=patient_data)
        if patient_serializer.is_valid():
            return JsonResponse("Changed patient", safe=False)
        return JsonResponse("Failed to change patient", safe=False)
        
    elif request.method=='DELETE':
        patient = Patient.objects.get(peID=id)
        patient.delete()
        return JsonResponse("Deleted patient", safe=False)

# Arzt API
def arztAPI(request, id=0):
    if request.method=='GET':
        arzt = Arzt.objects.all()
        arzt_serializer = ArztSerializer(arzt, many=True)
        return JsonResponse(arzt_serializer.data, safe=False)

    elif request.method=='POST':
        arzt_data = JSONParser().parse(request)
        arzt_serializer = ArztSerializer(data=arzt_data)
        if arzt_serializer.is_valid():
            arzt_serializer.save()
            return JsonResponse("Added arzt", safe=False)
        return JsonResponse("Failed to add arzt", safe=False)

    elif request.method=='PUT':
        arzt_data = JSONParser().parse(request)
        arzt=Arzt.objects.get(peID=arzt_data['peID'])
        arzt_serializer=ArztSerializer(arzt,data=arzt_data)
        if arzt_serializer.is_valid():
            return JsonResponse("Changed arzt", safe=False)
        return JsonResponse("Failed to change arzt", safe=False)
        
    elif request.method=='DELETE':
        arzt = Arzt.objects.get(peID=id)
        arzt.delete()
        return JsonResponse("Deleted arzt", safe=False)

# Befund API
def befundAPI(request, id=0):
    if request.method=='GET':
        befund = Befund.objects.all()
        befund_serializer = BefundSerializer(befund, many=True)
        return JsonResponse(befund_serializer.data, safe=False)

    elif request.method=='POST':
        befund_data = JSONParser().parse(request)
        befund_serializer = BefundSerializer(data=befund_data)
        if befund_serializer.is_valid():
            befund_serializer.save()
            return JsonResponse("Added befund", safe=False)
        return JsonResponse("Failed to add befund", safe=False)

    elif request.method=='PUT':
        befund_data = JSONParser().parse(request)
        befund=Befund.objects.get(peID=befund_data['peID'])
        befund_serializer=BefundSerializer(befund,data=befund_data)
        if befund_serializer.is_valid():
            return JsonResponse("Changed befund", safe=False)
        return JsonResponse("Failed to change befund", safe=False)
        
    elif request.method=='DELETE':
        befund = Befund.objects.get(peID=id)
        befund.delete()
        return JsonResponse("Deleted befund", safe=False)

# Patientenzugriff API
def patientenzugriffAPI(request, id=0):
    if request.method=='GET':
        patientenzugriff = PatientenZugriff.objects.all()
        patientenzugriff_serializer = PatientenZugriffSerializer(patientenzugriff, many=True)
        return JsonResponse(patientenzugriff_serializer.data, safe=False)

    elif request.method=='POST':
        patientenzugriff_data = JSONParser().parse(request)
        patientenzugriff_serializer = PatientenZugriffSerializer(data=patientenzugriff_data)
        if patientenzugriff_serializer.is_valid():
            patientenzugriff_serializer.save()
            return JsonResponse("Added patientenzugriff", safe=False)
        return JsonResponse("Failed to add patientenzugriff", safe=False)

    elif request.method=='PUT':
        patientenzugriff_data = JSONParser().parse(request)
        patientenzugriff=PatientenZugriff.objects.get(peID=patientenzugriff_data['peID'])
        patientenzugriff_serializer=PatientenZugriffSerializer(patientenzugriff,data=patientenzugriff_data)
        if patientenzugriff_serializer.is_valid():
            return JsonResponse("Changed patientenzugriff", safe=False)
        return JsonResponse("Failed to change patientenzugriff", safe=False)
        
    elif request.method=='DELETE':
        patientenzugriff = PatientenZugriff.objects.get(peID=id)
        patientenzugriff.delete()
        return JsonResponse("Deleted patientenzugriff", safe=False)

# Arztzugriff API
def arztzugriff(request, id=0):
    if request.method=='GET':
        arztzugriff = ArztZugriff.objects.all()
        arztzugriff_serializer = ArztZugriffSerializer(arztzugriff, many=True)
        return JsonResponse(arztzugriff_serializer.data, safe=False)

    elif request.method=='POST':
        arztzugriff_data = JSONParser().parse(request)
        arztzugriff_serializer = ArztZugriffSerializer(data=arztzugriff_data)
        if arztzugriff_serializer.is_valid():
            arztzugriff_serializer.save()
            return JsonResponse("Added arztzugriff", safe=False)
        return JsonResponse("Failed to add arztzugriff", safe=False)

    elif request.method=='PUT':
        arztzugriff_data = JSONParser().parse(request)
        arztzugriff=ArztZugriff.objects.get(peID=arztzugriff_data['peID'])
        arztzugriff_serializer=ArztZugriffSerializer(arztzugriff,data=arztzugriff_data)
        if arztzugriff_serializer.is_valid():
            return JsonResponse("Changed arztzugriff", safe=False)
        return JsonResponse("Failed to change arztzugriff", safe=False)
        
    elif request.method=='DELETE':
        arztzugriff = ArztZugriff.objects.get(peID=id)
        arztzugriff.delete()
        return JsonResponse("Deleted arztzugriff", safe=False)
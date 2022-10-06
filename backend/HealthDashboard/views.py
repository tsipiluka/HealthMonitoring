from wsgiref.util import request_uri
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from HealthDashboard.models import Person, Patient, Arzt, Befund, PatientenZugriff, ArztZugriff
from HealthDashboard.serializers import PersonSerializer, PatientSerializer, ArztSerializer, BefundSerializer, PatientenZugriffSerializer, ArztZugriffSerializer 

# Create your views here.

@csrf_exempt
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
    


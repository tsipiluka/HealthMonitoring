from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework.response import Response
from .models import MedicalFinding, FindingAccessRight
from .serializer import MedicalFindingSerializer, FindingAccessRightSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user_system.models import Patient, Doctor, User

class MedicalFindingView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        medicalFindings = MedicalFinding.objects.filter(user=user)
        serializer = MedicalFindingSerializer(medicalFindings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print(request.data)
        try:
            user = request.user
            data = request.data
            data["user"] = user.id
            serializer = MedicalFindingSerializer(data=data)

            if not serializer.is_valid():
                return Response(
                    {
                        "status": False,
                        "message": "invalid fields",
                        "data": serializer.errors,
                    }
                )

            serializer.save()
            return Response(
                {
                    "status": True,
                    "message": "Medical Finding is created",
                    "data": serializer.data,
                }
            )

        except Exception as e:
            return Response(
                {"status": False, "message": "something went wrong", "data": {}}
            )

    def patch(self, request):
        try:
            data = request.data
            if not data.get("uid"):
                return Response(
                    {"status": False, "message": "uid is required", "data": {}}
                )

            obj = MedicalFinding.objects.filter(uid=data.get("uid"))
            serializer = MedicalFindingSerializer(obj[0], data=data, partial=True)
            if not serializer.is_valid():
                return Response(
                    {
                        "status": False,
                        "message": "invalid fields",
                        "data": serializer.errors,
                    }
                )

            serializer.save()
            return Response(
                {
                    "status": True,
                    "message": "Medical Finding was updated",
                    "data": serializer.data,
                }
            )

        except Exception as e:
            print(e)
            return Response(
                {"status": False, "message": "something went wrong", "data": {}}
            )

    def delete(self, request):
        try:
            data = request.data
            if not data.get("uid"):
                return Response(
                    {"status": False, "message": "uid is required", "data": {}}
                )

            obj = MedicalFinding.objects.filter(uid=data.get("uid"))
            obj.delete()
            return Response(
                {
                    "status": True,
                    "message": "Medical Finding was successfully deleted",
                }
            )

        except Exception as e:
            print(e)
            return Response(
                {"status": False, "message": "something went wrong", "data": {}}
            )


class FindingAccesRightView(APIView):
    
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
    
        def get(self, request):
            user = request.user
            # findingAccessRights where user is initiator or receiver
            findingAccessRights = FindingAccessRight.objects.filter(initiator=user) | FindingAccessRight.objects.filter(receiver=user)
            serializer = FindingAccessRightSerializer(findingAccessRights, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class EditAccessRightView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        user = request.user
        # check if user is doctor
        if not user.is_doctor:
            return Response({"Only doctors can edit access rights"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # check serializer validity
            serializer = FindingAccessRightSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {
                        "status": False,
                        "message": "invalid fields",
                        "data": serializer.errors,
                    }
                )
            request.data["initiator"] = user.id
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


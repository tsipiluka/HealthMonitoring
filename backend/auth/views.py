from django.shortcuts import render
from user_system.models import User
from .serializers import ChangePasswordSerializer, RegisterSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = () # AllowAny
    serializer_class = RegisterSerializer
    

class DeleteUserView(APIView):
    def delete(self, request, format=None):
        print(request.user)
        try:
            user = User.objects.get(id=request.user.id)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(UpdateAPIView):
        """
        An endpoint for changing password.
        """
        
        serializer_class = ChangePasswordSerializer
        model = User
        permission_classes = (IsAuthenticated,)

        def get_object(self, queryset=None):
            obj = self.request.user
            return obj

        def update(self, request, *args, **kwargs):
            self.object = self.get_object()
            serializer = self.get_serializer(data=request.data)
            user = User.objects.get(id=request.user.id)
            if serializer.is_valid():
                # Check old password
                if not self.object.check_password(serializer.data.get("old_password")):
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
                # set_password also hashes the password that the user will get
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                response = {
                    'status': 'success',
                    'code': status.HTTP_200_OK,
                    'message': 'Password updated successfully',
                    'data': []
                }
                return Response(response)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

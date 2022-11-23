from django.urls import path

from . import views


app_name = 'user_system'
urlpatterns = [
    path('patient_profile/', views.PatientProfile.as_view(), name='patient_profile'),
]
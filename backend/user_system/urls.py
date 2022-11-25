from django.urls import include, path

from . import views


app_name = 'user_system'
urlpatterns = [
    path('patient_profile/', views.PatientProfile.as_view(), name='patient_profile'),
    # path('accounts/', include('django.contrib.auth.urls')), # https://docs.djangoproject.com/en/4.1/topics/auth/default/#module-django.contrib.auth.views
    path('hello2/', views.TestHello2.as_view(), name='hello2'),
]
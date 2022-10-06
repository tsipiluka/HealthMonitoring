from django.urls import re_path
from HealthDashboard import views


urlpatterns=[
    re_path(r'^person/$', views.personApi),
    re_path(r'^person/([0-9]+)$', views.personApi)
]
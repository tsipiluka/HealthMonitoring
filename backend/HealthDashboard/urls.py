from django.urls import re_path
from HealthDashboard import views


urlpatterns=[
    re_path(r'^person/$', views.personApi),
    re_path(r'^person/([0-9]+)$', views.personApi),

    re_path(r'^patient/$', views.patientAPI),
    re_path(r'^patient/([0-9]+)$', views.patientAPI),

    re_path(r'^arzt/$', views.arztAPI),
    re_path(r'^arzt/([0-9]+)$', views.arztAPI),

    re_path(r'^befund/$', views.befundAPI),
    re_path(r'^befund/([0-9]+)$', views.befundAPI),
]
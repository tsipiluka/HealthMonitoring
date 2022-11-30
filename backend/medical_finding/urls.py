from django.urls import include, path

from . import views


app_name = 'medical_finding'
urlpatterns = [
    path('finding_access_rights/', views.FindingAccesRightView.as_view(), name='finding_access_rights'),
    path('edit_access_right/', views.EditAccessRightView.as_view(), name='edit_access_right'),
]
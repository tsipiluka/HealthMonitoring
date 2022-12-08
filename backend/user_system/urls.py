from django.urls import path

from user_system import views


app_name = "user_system"
urlpatterns = [
    path("user_profile/", views.UserProfileView.as_view(), name="user_profile"),
    path("user/", views.GetUserByProfiledID.as_view(), name="user_profile"),
]

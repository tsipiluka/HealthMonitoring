from django.contrib import admin

from user_system.models import User, Doctor, Patient, PatientProfile, DoctorProfile

# Register your models here.

admin.site.register(User)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(PatientProfile)
admin.site.register(DoctorProfile)

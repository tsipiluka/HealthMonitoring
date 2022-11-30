from django.contrib import admin

# Register your models here.
from .models import MedicalFinding, FindingAccessRight

admin.site.register(MedicalFinding)
admin.site.register(FindingAccessRight)
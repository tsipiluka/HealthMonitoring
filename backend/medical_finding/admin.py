from django.contrib import admin

# Register your models here.
from .models import MedicalFinding, FindingReadingRight

admin.site.register(MedicalFinding)
admin.site.register(FindingReadingRight)

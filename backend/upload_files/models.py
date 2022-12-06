from django.db import models
from user_system.models import User
# from .models import File

class File(models.Model):
    file = models.FileField(blank=False, null=False)
    file_name = models.CharField(max_length=100, blank=False, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

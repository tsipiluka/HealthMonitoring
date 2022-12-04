from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class AuthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "auth"

    def ready(self):
        #import backend.auth.signals
        from . import signals
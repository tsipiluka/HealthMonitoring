from django.core.management.base import BaseCommand
from django.utils import timezone
from user_system.models import User, DoctorProfile

class Command(BaseCommand):
    """
    Create a patient with an interactive prompt
    """
    help = "Create a patient"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str)
        parser.add_argument("password", type=str)
        parser.add_argument("first_name", type=str)
        parser.add_argument("last_name", type=str)

    def handle(self, *args, **options):
        email = options["email"]
        password = options["password"]
        first_name = options["first_name"]
        last_name = options["last_name"]
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.PATIENT,
            is_active=True,
        )

        # also create the DoctorProfile for the instance
        #DoctorProfile.objects.create(user=user, doctor_id=user.id)

        self.stdout.write(self.style.SUCCESS("Patient created successfully"))
        
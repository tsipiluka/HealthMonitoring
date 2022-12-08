from base64 import urlsafe_b64encode
from django.core.mail import send_mail

from user_system.models import User
from .tokens import email_verification_token
from django.utils.encoding import force_str, force_bytes


def send_activation_mail(user: User):
    # current_site = get_current_site(self.request)
    subject = "Activate Your Account"
    token = email_verification_token.make_token(user)
    # base64 encode the uid
    uid = urlsafe_b64encode(force_bytes(user.pk))
    # remove the b' from the uid
    uid = force_str(uid)
    send_mail(
        subject,
        f"Hello {user.first_name} \nThis is a message sent to you because you registered at Health Monitoring Portal.\n Visit http://localhost:4200/activate/{token}/{uid}",
        "notify@wh0cares.live",
        [user.email],
        fail_silently=False,
    )

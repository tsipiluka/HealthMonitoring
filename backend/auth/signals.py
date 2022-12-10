from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    This is the signal receiver function which will be called when signal
    `reset_password_token_created` is sent. This function will receive
    the sender, the instance of the signal and the reset password token
    model object instance.
    """
    # current_site = get_current_site(self.request)
    subject = "Reset your password"
    token = reset_password_token.key
    send_mail(
        subject,
        f"Visit the following link to reset your password at HealthMonitoring http://localhost:4200/password-reset/{token}",
        "notify@wh0cares.live",
        [reset_password_token.user.email],
        fail_silently=False,
    )
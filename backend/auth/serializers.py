from django.forms import ValidationError
from rest_framework import serializers
from user_system.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .utils.activation_mail import send_activation_mail


class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    birth_date = serializers.DateField(required=True)

    class Meta:
        model = User
        fields = (
            "password",
            "password2",
            "email",
            "first_name",
            "last_name",
            "birth_date",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # check that last name is not empty and first name is not empty
        if attrs["first_name"] == "":
            raise serializers.ValidationError(
                {"first_name": "First name cannot be empty."}
            )
        if attrs["last_name"] == "":
            raise serializers.ValidationError(
                {"last_name": "Last name cannot be empty."}
            )

        # if role exists throw error
        if "role" in attrs:
            raise serializers.ValidationError({"role": "Role cannot be set manually."})
        # only allow fields that are in fields
        unknown = set(self.initial_data) - set(self.fields)
        if unknown:
            raise ValidationError("Forbidden field(s): {}".format(", ".join(unknown)))

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            birth_date=validated_data["birth_date"],
        )
        user.set_password(validated_data["password"])
        user.save()

        try:
            send_activation_mail(user)
        except Exception as e:
            print(e)
            print("email not sent")

        return user


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."}
            )

        return attrs

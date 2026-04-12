from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    ROLE = (
        ('doctor', 'Doctor'),
        ('rediologist', 'Radiologist'),
    )
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True, default=None)
    role = models.CharField(max_length=20, choices=ROLE)
    hostpital_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)

    def is_doctor(self):
        return self.role == 'doctor'
    
    def is_radiologist(self):
        return self.role == 'radiologist'
    
    def __str__(self):
        return f"{self.role} at {self.hostpital_name}"
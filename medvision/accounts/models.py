from django.db import models

# Create your models here.

class CustomUser(models.Model):
    ROLE = (
        ('doctor', 'Doctor'),
        ('rediologist', 'Radiologist'),
    )

    role = models.CharField(max_length=20, choices=ROLE)
    hostpital_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)

    def is_doctor(self):
        return self.role == 'doctor'
    
    def is_radiologist(self):
        return self.role == 'radiologist'
    
    def __str__(self):
        return f"{self.role} at {self.hostpital_name}"
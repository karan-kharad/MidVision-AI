from django.db import models
from accounts.models import CustomUser

# Create your models here.

class Patient(models.Model):
    Gender_Choice =(("M","Male"), ("F","Female"), ("O","Other"))
    Blood_Type_Choice = (("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"), ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-"))

    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    blood_group = models.CharField(max_length=3, choices=Blood_Type_Choice)
    gender = models.CharField(max_length=1, choices=Gender_Choice)
    phone = models.CharField(max_length=13, unique=True)
    address = models.CharField(max_length=255)

    # medical info 

    medical_history = models.TextField(blank=True)
    current_medicines = models.TextField(blank=True)
    allergies = models.TextField(blank=True)

    # Linked Doctor and Radiologist

    doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='patients')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
    
    class Meta:
        ordering = ['-created_at']
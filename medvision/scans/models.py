from django.db import models
from accounts.models import CustomUser
from patients.models import Patient

# Create your models here.

class Scan(models.Model):

    Scan_type =(
        ("xray","X-Ray"),
        ("mri","MRI"),
        ("ct","CT Scan"),
    )

    Status_Choice =(
        ("pending","Pending"),
        ("completed","Completed"),
        ("cancelled","Cancelled"),
    )


    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="scans")
    scan_type = models.CharField(max_length=20, choices=Scan_type)
    scan_image = models.ImageField(upload_to='scans/')
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='uploaded_scans')
    status = models.CharField(max_length=20, choices=Status_Choice, default="pending")

    # AI  Results 

    ai_condition = models.CharField(max_length=255, blank=True)
    ai_confidence = models.FloatField(null=True, blank=True)
    ai_severity = models.CharField(max_length=255, blank=True)
    ai_findings = models.JSONField(default=list)
    ai_bbox = models.JSONField(default=list)
    annotated_image = models.ImageField(upload_to='annotated_scans/', blank=True)

    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.scan_type} - {self.created_at.date()}"

    class Meta :
        ordering = ['-created_at'] 
    

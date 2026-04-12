from django.db import models

from scans.models import Scan
from accounts.models import CustomUser
# Create your models here.

class Report(models.Model):
    scan = models.OneToOneField(Scan, on_delete=models.CASCADE, related_name='report')
    generated_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='generated_reports')
    findings = models.TextField()
    recommendations = models.TextField()
    ai_summary = models.TextField()
    pdf_file = models.FileField(upload_to='reports/pdf/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.scan.patient.full_name}"
    
    
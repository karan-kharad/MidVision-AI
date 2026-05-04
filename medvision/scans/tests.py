import os
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from patients.models import Patient
from scans.models import Scan

class ScanAPITest(APITestCase):
    def setUp(self):
        self.doctor = CustomUser.objects.create_user(
            username='doctor1',
            email='doc1@example.com',
            password='password123',
            role='doctor',
            hospital_name='Test Hosp'
        )
        self.patient = Patient.objects.create(
            full_name="John Doe",
            age=30,
            blood_group="A+",
            gender="M",
            phone="+919876543210",
            address="123 Main St",
            doctor=self.doctor
        )
        self.client.force_authenticate(user=self.doctor)

    def test_upload_scan_missing_data(self):
        url = '/api/scans/upload/'
        # Missing patient_id and image
        response = self.client.post(url, {}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Testing the fixed error message
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'patient_id and image are required.')

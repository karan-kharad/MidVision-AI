from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from .models import Patient

class PatientAPITest(APITestCase):
    def setUp(self):
        self.doctor = CustomUser.objects.create_user(
            username='doctor1',
            email='doc1@example.com',
            password='password123',
            role='doctor',
            hospital_name='Test Hosp'
        )
        self.client.force_authenticate(user=self.doctor)

    def test_create_patient(self):
        url = '/api/patients/'
        data = {
            "full_name": "John Doe",
            "age": 30,
            "blood_group": "A+",
            "gender": "M",
            "phone": "+919876543210",
            "address": "123 Main St",
            "medical_history": "None",
            "current_medicines": "None",
            "allergies": "None"
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        patient = Patient.objects.get(full_name="John Doe")
        self.assertEqual(patient.doctor, self.doctor)

    def test_patient_str(self):
        patient = Patient.objects.create(
            full_name="Jane Doe",
            age=25,
            blood_group="B+",
            gender="F",
            phone="+919876543211",
            address="456 Side St"
        )
        self.assertEqual(str(patient), "Jane Doe")

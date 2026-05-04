from django.test import TestCase
from .models import CustomUser

class CustomUserModelTest(TestCase):
    def setUp(self):
        self.doctor = CustomUser.objects.create_user(
            username='dr_smith',
            email='dr@example.com',
            password='password123',
            role='doctor',
            hospital_name='General Hospital'
        )
        self.radiologist = CustomUser.objects.create_user(
            username='rad_jane',
            email='rad@example.com',
            password='password123',
            role='radiologist',
            hospital_name='Scan Center'
        )

    def test_user_roles(self):
        # Using properties now
        self.assertTrue(self.doctor.is_doctor)
        self.assertTrue(self.radiologist.is_radiologist)

    def test_str_method(self):
        self.assertEqual(str(self.doctor), "doctor at General Hospital")

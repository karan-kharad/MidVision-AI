from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer
from accounts.permissions import IsDoctor 

# Create your views here.
class PatinetListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_queryset(self):
        user = self.request.user
        if user.is_doctor:
            return Patient.objects.filter(doctor=user)
        return Patient.objects.none()
    
class PatinetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_queryset(self):
        user = self.request.user
        if user.is_doctor:
            return Patient.objects.filter(doctor=user)
        return Patient.objects.none()
    
from django.urls import path
from .views import ScanUploadView, ScanDetailView, ScanListView, PatientScansView

urlpatterns = [
    path('',                         ScanListView.as_view(),    name='scan-list'),
    path('upload/',                  ScanUploadView.as_view(),  name='scan-upload'),
    path('<int:pk>/',                ScanDetailView.as_view(),  name='scan-detail'),
    path('patient/<int:patient_id>/',PatientScansView.as_view(),name='patient-scans'),
]
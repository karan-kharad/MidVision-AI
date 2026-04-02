from django.urls import path
from . views import *

urlpatterns = [
   path('', PatinetListCreateView.as_view(), name='patient-list-create'),
   path('<int:pk>/', PatinetDetailView.as_view(), name='patient-detail'),
]
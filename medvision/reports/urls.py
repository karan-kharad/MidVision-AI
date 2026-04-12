from django.urls import path
from .views import GenerateReportView, DownloadReportView

urlpatterns = [
    path('generate/',      GenerateReportView.as_view(),  name='generate-report'),
    path('<int:pk>/',      DownloadReportView.as_view(),  name='report-detail'),
]

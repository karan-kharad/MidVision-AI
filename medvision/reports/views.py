from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Report
from scans.models import Scan
from medvision.ai_engine import generate_report


class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        scan_id = request.data.get('scan_id')
        if not scan_id:
            return Response(
                {'error': 'scan_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        scan = get_object_or_404(Scan, id=scan_id)

        # Generate AI report text
        ai_summary = generate_report(
            scan_result={
                'condition':  scan.ai_condition,
                'confidence': scan.ai_confidence,
                'severity':   scan.ai_severity,
                'findings':   scan.ai_findings,
            },
            patient_name=scan.patient.full_name,
            scan_type=scan.scan_type
        )

        # Save report
        report, _ = Report.objects.update_or_create(
            scan=scan,
            defaults={
                'generated_by':    request.user,
                'findings':        str(scan.ai_findings),
                'recommendations': scan.ai_severity,  # ✅ fixed: was 'recommendation'
                'ai_summary':      ai_summary,
            }
        )

        return Response({
            'report_id':  report.id,
            'patient':    scan.patient.full_name,
            'scan_type':  scan.scan_type,
            'ai_summary': ai_summary,
            'created_at': report.created_at,
        }, status=status.HTTP_201_CREATED)


class DownloadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        report = get_object_or_404(Report, id=pk)
        return Response({
            'report_id':  report.id,
            'patient':    report.scan.patient.full_name,
            'ai_summary': report.ai_summary,
            'findings':   report.findings,
            'created_at': report.created_at,
        })
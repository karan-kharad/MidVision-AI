from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Scan
from patients.models import Patient
from medvision.ai_engine import analyze_scan, generate_report
from .annotator import draw_fracture_highlight

class ScanUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        scan_type = request.data.get('scan_type', 'xray')
        image = request.data.get('image')
        notes = request.data.get('notes', '')

        if not patient_id or not image:
            return Response({'error': "patient_id and image are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        patient = get_object_or_404(Patient, id=patient_id)

        scan = Scan.objects.create(
            patient= patient,
            uploaded_by = request.user,
            scan_type = scan_type,
            scan_image = image,
            notes = notes,
            status= 'analyzing'
        )

        # Gemini Analysis
    
        ai_result = analyze_scan(scan.scan_image.path, scan_type)

        # Draw hightlight

        bbox = ai_result.get('bbox',{})
        annotated_path = draw_fracture_highlight(image_path= scan.scan_image.path, bbox=bbox, 
        condition=ai_result.get('condition', ''), 
        confidence=ai_result.get('confidence', 0), 
        severity=ai_result.get('severity', 'low')
        )

        # save to DB 
        scan.ai_condition = ai_result.get('condition', '')
        scan.ai_confidence = ai_result.get('confidence', 0)
        scan.ai_severity = ai_result.get('severity', '')
        scan.ai_findings = ai_result.get('findings', [])
        scan.ai_bbox = bbox
        
        scan.ai_location = ai_result.get('location', '')
        scan.ai_recommendation = ai_result.get('recommendation', '')
        scan.ai_fracture_detected = ai_result.get('fracture_detected', False)
        
        scan.status = 'completed'

        if annotated_path:
            scan.annotated_image = annotated_path
        scan.save()

        return Response({
            'success': True,
            'scan_id': scan.id,
            'patient': scan.patient.full_name,
            'status': scan.status,
            'ai_result':{
                'condition': ai_result.get('condition', ''),
                'confidence': ai_result.get('confidence'),
                'severity': ai_result.get('severity'),
                'location': ai_result.get('location'),
                'findings': ai_result.get('findings'),
                'recommendation': ai_result.get('recommendation'),
                'fracture_detected': ai_result.get('fracture_detected'),
            },
            'images':{
                'original': request.build_absolute_uri(scan.scan_image.url),
                'annotated': request.build_absolute_uri(f'/media/{annotated_path}') if annotated_path else None,
            }
        },status=status.HTTP_201_CREATED)
    
class ScanDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        scan = get_object_or_404(Scan, id=pk)
        return Response({
            'scan_id':     scan.id,
            'patient':     scan.patient.full_name,
            'scan_type':   scan.scan_type,
            'status':      scan.status,
            'uploaded_by': scan.uploaded_by.username,
            'created_at':  scan.created_at,
            'ai_result': {
                'condition':  scan.ai_condition,
                'confidence': scan.ai_confidence,
                'severity':   scan.ai_severity,
                'findings':   scan.ai_findings,
                'location':   scan.ai_location,
                'recommendation': scan.ai_recommendation,
                'fracture_detected': scan.ai_fracture_detected,
            },
            'images': {
                'original':  request.build_absolute_uri(scan.scan_image.url) if scan.scan_image else None,
                'annotated': request.build_absolute_uri(
                    scan.annotated_image.url
                ) if scan.annotated_image else None,
            }
        })
    
class ScanListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_doctor:
            scans = Scan.objects.filter(patient__doctor=user)
        else:
            scans = Scan.objects.all()

        data = [{
            'scan_id':       s.id,
            'id':            s.id,
            'patient':       s.patient.full_name,
            'scan_type':     s.scan_type,
            'type':          s.scan_type,
            'condition':     s.ai_condition,
            'confidence':    s.ai_confidence,
            'severity':      s.ai_severity,
            'status':        s.status,
            'created_at':    s.created_at,
            'date':          str(s.created_at),
            'thumb':         request.build_absolute_uri(s.scan_image.url) if s.scan_image else None,
            'original_url':  request.build_absolute_uri(s.scan_image.url) if s.scan_image else None,
            'annotated_url': request.build_absolute_uri(
                s.annotated_image.url
            ) if s.annotated_image else None,
        } for s in scans]

        return Response({'count': len(data), 'scans': data})

class PatientScansView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)
        scans   = Scan.objects.filter(patient=patient)

        data = [{
            'scan_id':       s.id,
            'scan_type':     s.scan_type,
            'condition':     s.ai_condition,
            'confidence':    s.ai_confidence,
            'severity':      s.ai_severity,
            'status':        s.status,
            'created_at':    s.created_at,
            'original_url':  request.build_absolute_uri(s.scan_image.url) if s.scan_image else None,
            'annotated_url': request.build_absolute_uri(
                s.annotated_image.url
            ) if s.annotated_image else None,
        } for s in scans]

        return Response({
            'patient':     patient.full_name,
            'total_scans': len(data),
            'scans':       data
        })
    

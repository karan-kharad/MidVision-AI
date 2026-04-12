from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source = 'scan.patient.full_name', read_only= True
    )
    scan_type = serializers.CharField(
        source = 'scan.scan_type', read_only = True
    )

    pdf_url = serializers.SerializerMethodField()

    class Meta :
        model = Report
        fields = '__all__'
        read_only_fields = ('id', 'created_at', "generated_by", 'pdf_file')

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and request:
            return request.build_absolute_url(obj.pdf_file.url)
        return None
from rest_framework import serializers
from .models import Scan

class ScanSerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source='patient.full_name', read_only=True)
    uploaded_by = serializers.CharField(source='uploaded_by.username', read_only=True)
    image_url = serializers.SerializerMethodField()
    annotated_url = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = '__all__'
        read_only_fields = ('id', 'status', 'ai_condition', 'ai_confidence',
            'ai_severity', 'ai_findings', 'ai_bbox',
            'annotated_image', 'created_at', 'updated_at' )

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.scan_image and request:
            return request.build_absolute_uri(obj.scan_image.url)
        # Fallback if no request context
        if obj.scan_image:
            return obj.scan_image.url
        return None
    
    def get_annotated_url(self, obj):
        request = self.context.get('request')
        if obj.annotated_image and request:
            return request.build_absolute_uri(obj.annotated_image.url)
        if obj.annotated_image:
            return obj.annotated_image.url
        return None
        
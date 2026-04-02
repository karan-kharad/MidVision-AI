from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
   doctor = serializers.CharField(source='doctor.username', read_only=True)
   scan_count = serializers.SerializerMethodField()
   class Meta :
        model = Patient 
        fields ='__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
 
   def get_scan_count(self, obj):
       return obj.scans.count()
   
   def create(self, validated_data):
    validated_data['doctor'] = self.context['request'].user
    return super().create(validated_data)
   
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserProfileSerializer
from .models import CustomUser
from django.contrib.auth import authenticate

# Create your views here.


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]    
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response (
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresher = RefreshToken.for_user(user)
        return Response ({
            'refresh': str(refresher),
            'access': str(refresher.access_token),
            'user': UserProfileSerializer(user).data
        })


class LoyoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        def post (self, request):
           try:
                refersh = request.data.get('refresh')
                token = RefreshToken(refersh)
                token.blacklist()
                return Response({'message': 'Logged out successfully'}, status=status.HTTP_205_RESET_CONTENT)
           except Exception:
                   return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
class UserProfileView(APIView):
    permissoion_classes = [IsAuthenticated]
    serialiser_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
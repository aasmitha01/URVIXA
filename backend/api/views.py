from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from .models import (
    Profile, Farm, SoilReport, DiseaseAnalysis,
    CropRecommendation, EquipmentBooking, EquipmentListing, CommunityPost,
    CommunityComment, Notification
)
from .serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer,
    FarmSerializer, SoilReportSerializer, DiseaseAnalysisSerializer,
    CropRecommendationSerializer, EquipmentBookingSerializer, EquipmentListingSerializer,
    CommunityPostSerializer, CommunityCommentSerializer, NotificationSerializer
)

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        profile, _ = Profile.objects.get_or_create(user=user)
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'profile': ProfileSerializer(profile).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        credential = request.data.get('credential') or request.data.get('email') or request.data.get('username')
        password = request.data.get('password')

        if not credential or not password:
            return Response({'detail': 'Email/Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow login via username OR email address
        user = None
        if '@' in credential:
            try:
                user_obj = User.objects.get(email__iexact=credential)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        
        if not user:
            user = authenticate(username=credential, password=password)

        if not user:
            return Response({'detail': 'Invalid credentials. Please check your email/username and password.'}, status=status.HTTP_401_UNAUTHORIZED)

        profile, _ = Profile.objects.get_or_create(user=user, defaults={'full_name': user.username, 'role': 'FARMER'})
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'profile': ProfileSerializer(profile).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email address is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email__iexact=email)
            # Create dummy reset token
            import uuid
            token = str(uuid.uuid4())
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.reset_token = token
            profile.save()
            return Response({
                'message': f'Password reset link generated for {email}. Please check your inbox.',
                'reset_token': token
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # For security, return success message even if email doesn't exist
            return Response({
                'message': f'If an account exists for {email}, a password reset link has been dispatched.'
            }, status=status.HTTP_200_OK)

class MeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(responses={200: ProfileSerializer})
    def get(self, request):
        profile, created = Profile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.username, 'role': 'FARMER'}
        )
        serializer = ProfileSerializer(profile)
        return Response({
            'user': UserSerializer(request.user).data,
            'profile': serializer.data
        })

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FarmViewSet(viewsets.ModelViewSet):
    serializer_class = FarmSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Farm.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SoilReportViewSet(viewsets.ModelViewSet):
    serializer_class = SoilReportSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SoilReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DiseaseAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = DiseaseAnalysisSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return DiseaseAnalysis.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='analyze')
    def analyze_crop_disease(self, request):
        crop = request.data.get('crop', 'Tomato')
        image_url = request.data.get('image_url', '')
        
        analysis = DiseaseAnalysis.objects.create(
            user=request.user,
            crop=crop,
            image_url=image_url,
            disease_name=f'Early Blight ({crop})',
            severity='Medium',
            confidence=94.5,
            affected_area='15% of lower leaf surface',
            symptoms='Concentric ring lesions, chlorosis on margins.',
            treatment='Apply Copper Fungicide or Mancozeb 75% WP every 7-10 days.',
            prevention='Crop rotation, drip irrigation to reduce leaf wetness.'
        )
        serializer = self.get_serializer(analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CropRecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = CropRecommendationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return CropRecommendation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EquipmentBookingViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentBookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return EquipmentBooking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EquipmentListingViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentListingSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return EquipmentListing.objects.all()

    def perform_create(self, serializer):
        profile = getattr(self.request.user, 'profile', None)
        owner_name = profile.full_name if profile and profile.full_name else self.request.user.username
        owner_phone = profile.mobile if profile and profile.mobile else '+91 98450 12345'
        owner_location = f"{profile.village}, {profile.district}" if profile and profile.village else "Chandapur Village, Medak"
        
        serializer.save(
            user=self.request.user,
            owner_name=self.request.data.get('owner_name') or owner_name,
            owner_phone=self.request.data.get('owner_phone') or owner_phone,
            owner_location=self.request.data.get('owner_location') or owner_location
        )

class CommunityPostViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityPostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return CommunityPost.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        action_type = request.data.get('action', 'like')
        if action_type == 'unlike':
            post.likes = max(0, post.likes - 1)
        else:
            post.likes += 1
        post.save()
        return Response({'status': action_type, 'likes': post.likes})

class CommunityCommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityCommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return CommunityComment.objects.filter(post_id=post_id)
        return CommunityComment.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

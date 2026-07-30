from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView, LoginView, ForgotPasswordView, MeView, ProfileViewSet, FarmViewSet,
    SoilReportViewSet, DiseaseAnalysisViewSet, CropRecommendationViewSet,
    EquipmentBookingViewSet, EquipmentListingViewSet, CommunityPostViewSet, CommunityCommentViewSet,
    NotificationViewSet
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'soil-reports', SoilReportViewSet, basename='soilreport')
router.register(r'disease-analyses', DiseaseAnalysisViewSet, basename='diseaseanalysis')
router.register(r'crop-recommendations', CropRecommendationViewSet, basename='croprecommendation')
router.register(r'equipment-bookings', EquipmentBookingViewSet, basename='equipmentbooking')
router.register(r'equipment-listings', EquipmentListingViewSet, basename='equipmentlisting')
router.register(r'community-posts', CommunityPostViewSet, basename='communitypost')
router.register(r'community-comments', CommunityCommentViewSet, basename='communitycomment')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='auth_me'),
    path('', include(router.urls)),
]

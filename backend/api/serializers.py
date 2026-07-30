from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, Farm, SoilReport, DiseaseAnalysis,
    CropRecommendation, EquipmentBooking, EquipmentListing, CommunityPost,
    CommunityComment, Notification
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')
    role = serializers.CharField(write_only=True, required=False, default='FARMER')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'full_name', 'role')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        role = validated_data.pop('role', 'FARMER').upper()
        if role not in ['FARMER', 'EXPERT', 'BUYER', 'ADMIN']:
            role = 'FARMER'
        
        email = validated_data.get('email', '')
        username = validated_data.get('username') or email.split('@')[0]

        # Ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password']
        )
        
        Profile.objects.create(
            user=user,
            full_name=full_name or user.username,
            role=role,
            email_verified=True
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class SoilReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilReport
        fields = '__all__'
        read_only_fields = ('id', 'user', 'generated_at')

class DiseaseAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseAnalysis
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class CropRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendation
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class EquipmentBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentBooking
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class EquipmentListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentListing
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

class CommunityCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = CommunityComment
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

    def get_author(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.full_name:
            return obj.user.profile.full_name
        return obj.user.username

class CommunityPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    comments = CommunityCommentSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = CommunityPost
        fields = '__all__'
        read_only_fields = ('id', 'user', 'likes', 'created_at')

    def get_author(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.full_name:
            return obj.user.profile.full_name
        return obj.user.username

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

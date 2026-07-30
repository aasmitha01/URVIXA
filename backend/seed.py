import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrisense.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import (
    Profile, Farm, SoilReport, DiseaseAnalysis,
    CropRecommendation, EquipmentBooking, CommunityPost,
    CommunityComment, Notification
)

DEMO_USERS = [
    {
        'username': 'farmer_urvixa',
        'email': 'farmer@urvixa.ai',
        'password': 'password123',
        'full_name': 'Ramesh Kumar',
        'role': 'FARMER',
        'village': 'Chandapur',
        'district': 'Medak',
    },
    {
        'username': 'expert_urvixa',
        'email': 'expert@urvixa.ai',
        'password': 'password123',
        'full_name': 'Dr. Priya Sharma',
        'role': 'EXPERT',
        'village': 'ICAR Center',
        'district': 'Hyderabad',
    },
    {
        'username': 'buyer_urvixa',
        'email': 'buyer@urvixa.ai',
        'password': 'password123',
        'full_name': 'Rajesh Patel (AgriTraders)',
        'role': 'BUYER',
        'village': 'Mandi Hub',
        'district': 'Nagpur',
    },
    {
        'username': 'admin_urvixa',
        'email': 'admin@urvixa.ai',
        'password': 'password123',
        'full_name': 'System Administrator',
        'role': 'ADMIN',
        'village': 'Urvixa H/Q',
        'district': 'Bengaluru',
    },
]

for user_data in DEMO_USERS:
    user, created = User.objects.get_or_create(username=user_data['username'], defaults={
        'email': user_data['email'],
        'is_staff': user_data['role'] == 'ADMIN',
        'is_superuser': user_data['role'] == 'ADMIN'
    })
    user.set_password(user_data['password'])
    user.email = user_data['email']
    user.save()

    profile, _ = Profile.objects.get_or_create(user=user)
    profile.full_name = user_data['full_name']
    profile.role = user_data['role']
    profile.village = user_data['village']
    profile.district = user_data['district']
    profile.email_verified = True
    profile.save()

farmer_user = User.objects.get(username='farmer_urvixa')

farm, _ = Farm.objects.get_or_create(name='Green Meadows Parcel A', user=farmer_user, defaults={
    'survey_no': 'SY-104/B',
    'village': 'Chandapur',
    'district': 'Medak',
    'area_acres': 5.5,
    'soil_type': 'Black Cotton Soil',
    'crop': 'Tomato',
    'stage': 'Vegetative',
})

SoilReport.objects.get_or_create(user=farmer_user, farm=farm, defaults={
    'ph': 6.8,
    'nitrogen': 140,
    'phosphorus': 42,
    'potassium': 210,
    'organic_carbon': 0.75,
    'report_data': {
        'recommendation': 'Add 25kg Organic Compost & NPK 19-19-19',
        'status': 'Optimal'
    }
})

DiseaseAnalysis.objects.get_or_create(user=farmer_user, disease_name='Early Blight (Tomato)', defaults={
    'crop': 'Tomato',
    'severity': 'Medium',
    'confidence': 94.5,
    'affected_area': '15% of foliage',
    'symptoms': 'Concentric ring lesions on lower leaves',
    'treatment': 'Apply Copper Fungicide or Mancozeb 75% WP every 7-10 days.',
    'prevention': 'Crop rotation, drip irrigation to reduce leaf wetness.'
})

# Clear any previous default dummy community posts and comments
CommunityComment.objects.all().delete()
CommunityPost.objects.all().delete()

Notification.objects.get_or_create(user=farmer_user, title='Soil Test Report Ready', defaults={
    'type': 'info',
    'message': 'Your soil test analysis for Green Meadows Parcel A is complete.',
    'is_read': False
})

print("Seed data with 4 role-based demo accounts successfully populated in Django database!")

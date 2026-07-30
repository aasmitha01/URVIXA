import uuid
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('FARMER', 'Farmer / Agriculturalist'),
        ('EXPERT', 'Agronomist Expert'),
        ('BUYER', 'Crop Buyer / Trader'),
        ('ADMIN', 'Enterprise Admin'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FARMER')
    mobile = models.CharField(max_length=30, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=50, default='English')
    avatar_url = models.URLField(blank=True, null=True)
    email_verified = models.BooleanField(default=True)
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.user.username}) - {self.role}"

class Farm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=255)
    survey_no = models.CharField(max_length=100, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    area_acres = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    soil_type = models.CharField(max_length=100, blank=True, null=True)
    crop = models.CharField(max_length=100, blank=True, null=True)
    stage = models.CharField(max_length=100, blank=True, null=True)
    planting_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class SoilReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='soil_reports', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soil_reports')
    ph = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    nitrogen = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    phosphorus = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    potassium = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    organic_carbon = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    report_data = models.JSONField(default=dict, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soil Report {self.id} for {self.user.username}"

class DiseaseAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disease_analyses')
    crop = models.CharField(max_length=100)
    image_url = models.TextField(blank=True, null=True)
    disease_name = models.CharField(max_length=255)
    severity = models.CharField(max_length=50, default='Medium')
    confidence = models.DecimalField(max_digits=5, decimal_places=2, default=95.0)
    affected_area = models.CharField(max_length=100, blank=True, null=True)
    symptoms = models.TextField(blank=True, null=True)
    treatment = models.TextField(blank=True, null=True)
    prevention = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.disease_name} on {self.crop}"

class CropRecommendation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_recommendations')
    inputs = models.JSONField(default=dict)
    results = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class EquipmentBooking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_bookings')
    equipment = models.CharField(max_length=255)
    booking_date = models.DateField()
    duration_hours = models.IntegerField(default=4)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class EquipmentListing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_listings')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    specs = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='hour')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    available = models.BooleanField(default=True)
    image = models.TextField(blank=True, null=True)
    owner_name = models.CharField(max_length=255)
    owner_phone = models.CharField(max_length=50)
    owner_location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class CommunityPost(models.Model):
    POST_TYPES = (
        ('question', 'Question'),
        ('tip', 'Tip'),
        ('story', 'Story'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts')
    type = models.CharField(max_length=20, choices=POST_TYPES, default='question')
    title = models.CharField(max_length=255)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class CommunityComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, default='info')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from api.models import Farm

@pytest.mark.django_db
def test_register_and_login():
    client = APIClient()
    reg_response = client.post('/api/auth/register/', {
        'username': 'testfarmer',
        'email': 'farmer@example.com',
        'password': 'Password123!',
        'full_name': 'Test Farmer'
    })
    assert reg_response.status_code in (200, 201)
    
    token_response = client.post('/api/auth/token/', {
        'username': 'testfarmer',
        'password': 'Password123!'
    })
    assert token_response.status_code == 200
    assert 'access' in token_response.data
    assert 'refresh' in token_response.data

@pytest.mark.django_db
def test_farm_creation():
    user = User.objects.create_user(username='farmowner', password='password')
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.post('/api/farms/', {
        'name': 'Green Acres',
        'area_acres': 12.5,
        'crop': 'Wheat'
    })
    assert response.status_code == 201
    assert response.data['name'] == 'Green Acres'
    assert Farm.objects.count() == 1

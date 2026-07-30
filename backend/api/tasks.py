from celery import shared_task
import time

@shared_task
def process_soil_sample_async(report_id):
    time.sleep(2)
    return f"Soil report {report_id} processed by Celery + Redis worker successfully."

@shared_task
def send_disease_alert_notification(user_id, disease_name):
    return f"Disease alert for {disease_name} sent to user {user_id} via Celery task queue."

from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase


class NewsletterThrottleTests(APITestCase):
    url = "/api/newsletter/"

    def setUp(self):
        cache.clear()  # repart d'un compteur de throttle vierge

    def tearDown(self):
        cache.clear()

    def test_throttled_after_limit(self):
        # Rate "10/hour" -> la 11e requête doit être refusée (429).
        last = None
        for i in range(11):
            last = self.client.post(self.url, {"email": f"u{i}@example.com"}, format="json")
        self.assertEqual(last.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

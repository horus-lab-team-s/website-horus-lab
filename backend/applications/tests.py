import io
import tempfile
import zipfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase


def _zip_bytes():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as archive:
        archive.writestr("cv.txt", "contenu de test")
    buf.seek(0)
    return buf.read()


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class ApplicationUploadTests(APITestCase):
    url = "/api/applications/"

    def _payload(self, document):
        return {
            "first_name": "Loic",
            "last_name": "Tonba",
            "email": "candidat@example.com",
            "phone": "+237600000000",
            "type": "emploi",
            "position": "Développeur",
            "message": "Bonjour, je postule.",
            "document": document,
            "page": "/candidature",
        }

    def test_accepts_zip(self):
        f = SimpleUploadedFile("dossier.zip", _zip_bytes(), content_type="application/zip")
        res = self.client.post(self.url, self._payload(f), format="multipart")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.content)

    def test_rejects_non_zip(self):
        f = SimpleUploadedFile("cv.pdf", b"%PDF-1.4 faux", content_type="application/pdf")
        res = self.client.post(self.url, self._payload(f), format="multipart")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("document", res.data)

    def test_rejects_oversize(self):
        big = b"P" * (15 * 1024 * 1024 + 10)  # > 15 Mo, extension .zip mais trop lourd
        f = SimpleUploadedFile("dossier.zip", big, content_type="application/zip")
        res = self.client.post(self.url, self._payload(f), format="multipart")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("document", res.data)

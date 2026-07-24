from django.test import TestCase

from .models import Category, Course, Module


class CoursesModelTests(TestCase):
    def test_catalog_shape(self):
        cat = Category.objects.create(slug="web", name_fr="Web", name_en="Web")
        course = Course.objects.create(
            slug="debuter-avec-react",
            category=cat,
            title_fr="Débutez avec React",
            title_en="Get started with React",
            is_free=True,
        )
        Module.objects.create(
            course=course,
            title_fr="Les fondations",
            title_en="Foundations",
            lessons_fr=["Pourquoi React ?"],
            lessons_en=["Why React?"],
        )
        self.assertEqual(cat.courses.count(), 1)
        self.assertEqual(course.curriculum.count(), 1)
        self.assertTrue(course.is_free)

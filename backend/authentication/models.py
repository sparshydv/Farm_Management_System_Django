from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
	google_sub = models.CharField(max_length=255, unique=True, null=True, blank=True)
	avatar_url = models.URLField(null=True, blank=True)

	def __str__(self) -> str:
		return self.user.username

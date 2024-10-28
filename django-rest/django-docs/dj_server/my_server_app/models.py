from django.db import models

# Create your models here.
# Models for connected DB are created via these classes that utilizy django's in built ORM
# These models are then synced to the respective DB via Django Migrations
class TodoItem(models.Model):
  title = models.CharField(max_length=200)
  completed = models.BooleanField(default=False)
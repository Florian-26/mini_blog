from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Article

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ArticleSerializer(serializers.ModelSerializer):
    class Meta: # Meta est une classe interne qui définit les métadonnées pour le serializer, les champs sont model, fields,
        model = Article
        fields = '__all__'  # 
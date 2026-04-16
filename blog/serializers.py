from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta: # Meta est une classe interne qui définit les métadonnées pour le serializer, les champs sont model, fields, 
        model = Article
        fields = '__all__'  # 
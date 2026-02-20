from rest_framework import viewsets
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import get_usd_to_inr_rate
from .services import get_top_headlines

@api_view(["GET"])
def currency_rate(request):
    rate = get_usd_to_inr_rate()
    
    if rate:
        return Response({
            "base": "USD",
            "target": "INR",
            "rate": rate
        })
    
    return Response({"error": "Unable to fetch rate"}, status=500)

@api_view(["GET"])
def top_headlines(request):
    articles = get_top_headlines()

    formatted = [
        {
            "title": article["title"],
            "link": article["link"],
            "source": article["source_name"],
            "image": article.get("image_url"),
            "published": article["pubDate"]
        }
        for article in articles
    ]

    return Response(formatted)
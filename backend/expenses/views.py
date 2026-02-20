from rest_framework import viewsets
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import get_usd_to_inr_rate

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
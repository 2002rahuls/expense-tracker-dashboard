from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from expenses.views import ExpenseViewSet
from expenses.views import currency_rate
from expenses.views import top_headlines

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api/currency-rate/", currency_rate),
    path("api/news/", top_headlines),
]
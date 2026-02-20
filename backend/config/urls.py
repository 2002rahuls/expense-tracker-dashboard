from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from expenses.views import ExpenseViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
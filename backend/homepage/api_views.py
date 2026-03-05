from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .api_serializers import (
    CropExpensesSerializer,
    CropOperationsSerializer,
    CropSalesSerializer,
    CropsSerializer,
    EggsProductionSerializer,
    EmployeesSerializer,
    LivestockProductionSerializer,
    LivestockSerializer,
    MachineryActivitiesSerializer,
    MachineryMaintenanceSerializer,
    MachinerySerializer,
    MilkProductionSerializer,
)
from .models import (
    Crop_expenses,
    Crop_operations,
    Crop_sales,
    Crops,
    Eggs_production,
    Employees,
    Livestock,
    Livestock_production,
    Machinery,
    Machinery_activities,
    Machinery_maintenance,
    Milk_production,
)


class EmployeesViewSet(ModelViewSet):
    serializer_class = EmployeesSerializer
    lookup_field = "Eid"

    def get_queryset(self):
        return Employees.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CropsViewSet(ModelViewSet):
    serializer_class = CropsSerializer
    lookup_field = "Cid"

    def get_queryset(self):
        return Crops.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CropExpensesViewSet(ModelViewSet):
    serializer_class = CropExpensesSerializer

    def get_queryset(self):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        return Crop_expenses.objects.filter(crops=crop)

    def perform_create(self, serializer):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        serializer.save(crops=crop)


class CropSalesViewSet(ModelViewSet):
    serializer_class = CropSalesSerializer

    def get_queryset(self):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        return Crop_sales.objects.filter(crops=crop)

    def perform_create(self, serializer):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        serializer.save(crops=crop)


class CropOperationsViewSet(ModelViewSet):
    serializer_class = CropOperationsSerializer

    def get_queryset(self):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        return Crop_operations.objects.filter(crops=crop)

    def perform_create(self, serializer):
        crop = get_object_or_404(Crops, Cid=self.kwargs["Cid"], user=self.request.user)
        serializer.save(crops=crop)


class MachineryViewSet(ModelViewSet):
    serializer_class = MachinerySerializer
    lookup_field = "Number_plate"

    def get_queryset(self):
        return Machinery.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MachineryActivitiesViewSet(ModelViewSet):
    serializer_class = MachineryActivitiesSerializer

    def get_queryset(self):
        machinery = get_object_or_404(
            Machinery, Number_plate=self.kwargs["Number_plate"], user=self.request.user
        )
        return Machinery_activities.objects.filter(machinery=machinery)

    def perform_create(self, serializer):
        machinery = get_object_or_404(
            Machinery, Number_plate=self.kwargs["Number_plate"], user=self.request.user
        )
        serializer.save(machinery=machinery)


class MachineryMaintenanceViewSet(ModelViewSet):
    serializer_class = MachineryMaintenanceSerializer

    def get_queryset(self):
        machinery = get_object_or_404(
            Machinery, Number_plate=self.kwargs["Number_plate"], user=self.request.user
        )
        return Machinery_maintenance.objects.filter(machinery=machinery)

    def perform_create(self, serializer):
        machinery = get_object_or_404(
            Machinery, Number_plate=self.kwargs["Number_plate"], user=self.request.user
        )
        serializer.save(machinery=machinery)


class LivestockViewSet(ModelViewSet):
    serializer_class = LivestockSerializer
    lookup_field = "Tag_number"

    def get_queryset(self):
        return Livestock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LivestockProductionViewSet(ModelViewSet):
    serializer_class = LivestockProductionSerializer

    def get_queryset(self):
        livestock = get_object_or_404(
            Livestock, Tag_number=self.kwargs["Tag_number"], user=self.request.user
        )
        return Livestock_production.objects.filter(livestock=livestock)

    def perform_create(self, serializer):
        livestock = get_object_or_404(
            Livestock, Tag_number=self.kwargs["Tag_number"], user=self.request.user
        )
        serializer.save(livestock=livestock)


class MilkProductionViewSet(ModelViewSet):
    serializer_class = MilkProductionSerializer

    def get_queryset(self):
        queryset = Milk_production.objects.filter(user=self.request.user)
        year = self.request.query_params.get("year")
        month = self.request.query_params.get("month")

        if year:
            queryset = queryset.filter(Year=year)
        if month:
            queryset = queryset.filter(Month=month)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EggsProductionViewSet(ModelViewSet):
    serializer_class = EggsProductionSerializer

    def get_queryset(self):
        queryset = Eggs_production.objects.filter(user=self.request.user)
        year = self.request.query_params.get("year")
        month = self.request.query_params.get("month")

        if year:
            queryset = queryset.filter(Year=year)
        if month:
            queryset = queryset.filter(Month=month)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
def milk_monthly_summary(request):
    year = request.query_params.get("year")
    month = request.query_params.get("month")

    queryset = Milk_production.objects.filter(user=request.user)
    if year:
        queryset = queryset.filter(Year=year)
    if month:
        queryset = queryset.filter(Month=month)

    totals = queryset.aggregate(
        total_production=Sum("Total_production"),
        total_consumption=Sum("Total_consumption"),
    )

    return Response(
        {
            "count": queryset.count(),
            "total_production": totals.get("total_production") or 0,
            "total_consumption": totals.get("total_consumption") or 0,
        }
    )


@api_view(["GET"])
def egg_monthly_summary(request):
    year = request.query_params.get("year")
    month = request.query_params.get("month")

    queryset = Eggs_production.objects.filter(user=request.user)
    if year:
        queryset = queryset.filter(Year=year)
    if month:
        queryset = queryset.filter(Month=month)

    totals = queryset.aggregate(
        total_egg_collection=Sum("Total_egg_collection"),
        total_feeds=Sum("Total_feeds"),
    )

    return Response(
        {
            "count": queryset.count(),
            "total_egg_collection": totals.get("total_egg_collection") or 0,
            "total_feeds": totals.get("total_feeds") or 0,
        }
    )

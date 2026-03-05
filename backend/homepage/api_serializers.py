from rest_framework import serializers

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


class EmployeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employees
        fields = "__all__"
        read_only_fields = ["user"]


class CropsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crops
        fields = "__all__"
        read_only_fields = ["user"]


class CropExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop_expenses
        fields = "__all__"
        read_only_fields = ["crops"]


class CropSalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop_sales
        fields = "__all__"
        read_only_fields = ["crops", "Total_price"]


class CropOperationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop_operations
        fields = "__all__"
        read_only_fields = ["crops"]


class MachinerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery
        fields = "__all__"
        read_only_fields = ["user"]


class MachineryActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery_activities
        fields = "__all__"
        read_only_fields = ["machinery"]


class MachineryMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery_maintenance
        fields = "__all__"
        read_only_fields = ["machinery"]


class LivestockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestock
        fields = "__all__"
        read_only_fields = ["user"]


class LivestockProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestock_production
        fields = "__all__"
        read_only_fields = ["livestock"]


class MilkProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milk_production
        fields = "__all__"
        read_only_fields = ["user", "Total_production", "Total_consumption"]


class EggsProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eggs_production
        fields = "__all__"
        read_only_fields = ["user", "Total_egg_collection", "Total_feeds"]

from django.contrib import admin
from .models import Employees

@admin.register(Employees)
class EmployeesAdmin(admin.ModelAdmin):
    list_display = ('Eid', 'Name', 'Phone_number', 'Position', 'Salary', 'Performance', 'user')
    search_fields = ('Name', 'Phone_number', 'Position')
    list_filter = ('Position',)

# Register other homepage models with ModelAdmin for better admin listings
from .models import (
    Crops,
    Crop_expenses,
    Crop_sales,
    Crop_operations,
    Machinery,
    Machinery_activities,
    Machinery_maintenance,
    Livestock,
    Livestock_production,
    Milk_production,
    Eggs_production,
)


@admin.register(Crops)
class CropsAdmin(admin.ModelAdmin):
    list_display = ('Cid', 'Field_name', 'Crop_name', 'Variety', 'Planting_date', 'Is_harvested', 'Harvesting_date')
    search_fields = ('Field_name', 'Crop_name', 'Variety')
    list_filter = ('Is_harvested',)


@admin.register(Crop_expenses)
class CropExpensesAdmin(admin.ModelAdmin):
    list_display = ('id', 'crops', 'Expense_date', 'Expense_type', 'Expense_amount', 'Supplier')
    search_fields = ('Expense_type', 'Supplier')
    list_filter = ('Expense_type',)


@admin.register(Crop_sales)
class CropSalesAdmin(admin.ModelAdmin):
    list_display = ('id', 'crops', 'Sale_date', 'Quantity_sold', 'Unit_price', 'Total_price', 'Payment_status')
    search_fields = ('Buyer_information', 'Invoice_number')
    list_filter = ('Payment_status',)


@admin.register(Crop_operations)
class CropOperationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'crops', 'Operation_date', 'Operation_name')
    search_fields = ('Operation_name',)
    list_filter = ('Operation_name',)


@admin.register(Machinery)
class MachineryAdmin(admin.ModelAdmin):
    list_display = ('Number_plate', 'Equipment_name', 'Purchase_price', 'Purchase_date')
    search_fields = ('Number_plate', 'Equipment_name')
    list_filter = ('Purchase_date',)


@admin.register(Machinery_activities)
class MachineryActivitiesAdmin(admin.ModelAdmin):
    list_display = ('id', 'machinery', 'Activity_date', 'Activity_type', 'Activity_cost')
    search_fields = ('Activity_type',)
    list_filter = ('Activity_type',)


@admin.register(Machinery_maintenance)
class MachineryMaintenanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'machinery', 'Date', 'Machinery_part', 'Technician_details', 'Cost')
    search_fields = ('Machinery_part', 'Technician_details')
    list_filter = ('Date',)


@admin.register(Livestock)
class LivestockAdmin(admin.ModelAdmin):
    list_display = ('Tag_number', 'Animal_type', 'Age', 'Breed')
    search_fields = ('Tag_number', 'Animal_type', 'Breed')
    list_filter = ('Animal_type',)


@admin.register(Livestock_production)
class LivestockProductionAdmin(admin.ModelAdmin):
    list_display = ('id', 'livestock', 'Production_date', 'Production_amount', 'Feed_consumed')
    search_fields = ('livestock__Tag_number',)
    list_filter = ('Production_date',)


@admin.register(Milk_production)
class MilkProductionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'Year', 'Month', 'Day', 'Livestock_number', 'Total_production', 'Total_consumption')
    search_fields = ('user__username',)
    list_filter = ('Year', 'Month')


@admin.register(Eggs_production)
class EggsProductionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'Year', 'Month', 'Day', 'Poultry_number', 'Total_egg_collection', 'Total_feeds')
    search_fields = ('user__username',)
    list_filter = ('Year', 'Month')

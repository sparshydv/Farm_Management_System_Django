from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from homepage.models import (
    Employees, Crops, Crop_expenses, Crop_sales, Crop_operations,
    Machinery, Machinery_activities, Machinery_maintenance,
    Livestock, Livestock_production, Milk_production, Eggs_production
)
from datetime import datetime, timedelta
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate dummy data for user1'

    def handle(self, *args, **options):
        try:
            user = User.objects.get(username='user1')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('User "user1" does not exist'))
            return

        self.stdout.write(self.style.SUCCESS('Starting to populate dummy data for user1...'))

        # Clear existing data for user1
        Employees.objects.filter(user=user).delete()
        Crops.objects.filter(user=user).delete()
        Machinery.objects.filter(user=user).delete()
        Livestock.objects.filter(user=user).delete()
        Milk_production.objects.filter(user=user).delete()
        Eggs_production.objects.filter(user=user).delete()

        # 1. CREATE EMPLOYEES
        self.stdout.write('Creating employees...')
        employees_data = [
            {'Eid': 1001, 'Name': 'Rajesh Kumar', 'Country_code': '+91', 'Phone_number': '9876543210', 'Position': 'Manager', 'Salary': 25000, 'Performance': 'Excellent'},
            {'Eid': 1002, 'Name': 'Mohan Singh', 'Country_code': '+91', 'Phone_number': '9876543211', 'Position': 'Laborer', 'Salary': 8000, 'Performance': 'Good'},
            {'Eid': 1003, 'Name': 'Priya Sharma', 'Country_code': '+91', 'Phone_number': '9876543212', 'Position': 'Accountant', 'Salary': 15000, 'Performance': 'Excellent'},
            {'Eid': 1004, 'Name': 'Vikram Patel', 'Country_code': '+91', 'Phone_number': '9876543213', 'Position': 'Mechanic', 'Salary': 12000, 'Performance': 'Very Good'},
            {'Eid': 1005, 'Name': 'Deepak Verma', 'Country_code': '+91', 'Phone_number': '9876543214', 'Position': 'Laborer', 'Salary': 8500, 'Performance': 'Good'},
        ]
        for emp_data in employees_data:
            Employees.objects.create(user=user, **emp_data)
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {len(employees_data)} employees'))

        # 2. CREATE CROPS
        self.stdout.write('Creating crops...')
        crops_data = [
            {'Cid': 2001, 'Field_name': 'North Field', 'Field_description': '5 acres fertile land', 'Crop_name': 'Wheat', 'Variety': 'HD-3118', 'Planting_date': datetime(2024, 10, 15).date(), 'Is_harvested': True, 'Harvesting_date': datetime(2025, 4, 15).date()},
            {'Cid': 2002, 'Field_name': 'South Field', 'Field_description': '3 acres', 'Crop_name': 'Rice', 'Variety': 'Basmati', 'Planting_date': datetime(2024, 6, 20).date(), 'Is_harvested': True, 'Harvesting_date': datetime(2024, 9, 20).date()},
            {'Cid': 2003, 'Field_name': 'East Field', 'Field_description': '4 acres irrigated', 'Crop_name': 'Corn', 'Variety': 'Hybrid Gold', 'Planting_date': datetime(2024, 7, 10).date(), 'Is_harvested': False, 'Harvesting_date': None},
        ]
        for crop_data in crops_data:
            Crops.objects.create(user=user, **crop_data)
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {len(crops_data)} crops'))

        # 3. CREATE CROP EXPENSES
        self.stdout.write('Creating crop expenses...')
        crops = list(Crops.objects.filter(user=user))
        expense_count = 0
        for crop in crops:
            expenses = [
                {'Expense_date': datetime(2024, 10, 10).date(), 'Expense_type': 'Seeds', 'Expense_description': f'{crop.Crop_name} seeds', 'Budget': Decimal('2500'), 'Expense_amount': Decimal('2450'), 'Supplier': 'AgriSeeds', 'Payment_method': 'Cash', 'Receipt_number': 'REC001'},
                {'Expense_date': datetime(2024, 10, 20).date(), 'Expense_type': 'Fertilizer', 'Expense_description': 'DAP and Urea', 'Budget': Decimal('3000'), 'Expense_amount': Decimal('3100'), 'Supplier': 'Krishak Supplies', 'Payment_method': 'Online', 'Receipt_number': 'REC002'},
                {'Expense_date': datetime(2024, 11, 5).date(), 'Expense_type': 'Pesticide', 'Expense_description': 'Insecticide spray', 'Budget': Decimal('1500'), 'Expense_amount': Decimal('1450'), 'Supplier': 'AgriChem', 'Payment_method': 'Check', 'Receipt_number': 'REC003'},
            ]
            for exp in expenses:
                Crop_expenses.objects.create(crops=crop, **exp)
                expense_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {expense_count} crop expenses'))

        # 4. CREATE CROP OPERATIONS
        self.stdout.write('Creating crop operations...')
        operations_count = 0
        for crop in crops:
            operations = [
                {'Operation_date': datetime(2024, 10, 20).date(), 'Operation_name': 'Watering', 'Additional_notes': 'First irrigation after sowing'},
                {'Operation_date': datetime(2024, 10, 25).date(), 'Operation_name': 'Pesticide Spray', 'Additional_notes': 'To control armyworm'},
                {'Operation_date': datetime(2024, 11, 5).date(), 'Operation_name': 'Weeding', 'Additional_notes': 'Manual weed removal'},
                {'Operation_date': datetime(2024, 12, 15).date(), 'Operation_name': 'Fertilizer Application', 'Additional_notes': 'NPK fertilizer added'},
            ]
            for op in operations:
                Crop_operations.objects.create(crops=crop, **op)
                operations_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {operations_count} crop operations'))

        # 5. CREATE CROP SALES
        self.stdout.write('Creating crop sales...')
        sales_count = 0
        for crop in crops:
            if crop.Is_harvested:
                sales = [
                    {'Sale_date': datetime(2025, 4, 20).date(), 'Quantity_sold': '500', 'Unit_price': Decimal('25'), 'Total_price': Decimal('12500'), 'Buyer_information': 'Sharma Grain Mills', 'Payment_method': 'Bank Transfer', 'Payment_status': 'received', 'Invoice_number': 'INV001', 'Additional_notes': 'Good quality'},
                    {'Sale_date': datetime(2025, 4, 25).date(), 'Quantity_sold': '300', 'Unit_price': Decimal('24'), 'Total_price': Decimal('7200'), 'Buyer_information': 'Local Cooperative', 'Payment_method': 'Check', 'Payment_status': 'pending', 'Invoice_number': 'INV002', 'Additional_notes': 'Bulk order'},
                ]
                for sale in sales:
                    Crop_sales.objects.create(crops=crop, **sale)
                    sales_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {sales_count} crop sales'))

        # 6. CREATE MACHINERY
        self.stdout.write('Creating machinery...')
        machinery_data = [
            {'Number_plate': 'TRX001', 'Equipment_name': 'Massey Ferguson Tractor', 'Purchase_price': Decimal('750000'), 'Purchase_date': datetime(2020, 1, 15).date(), 'Operation': 'Main tractor for plowing and harvesting'},
            {'Number_plate': 'THR001', 'Equipment_name': 'Combine Harvester', 'Purchase_price': Decimal('2200000'), 'Purchase_date': datetime(2019, 6, 10).date(), 'Operation': 'Wheat and rice harvesting'},
            {'Number_plate': 'PMP001', 'Equipment_name': 'Submersible Pump 5HP', 'Purchase_price': Decimal('35000'), 'Purchase_date': datetime(2022, 5, 20).date(), 'Operation': 'Irrigation from tubewell'},
        ]
        for mach_data in machinery_data:
            Machinery.objects.create(user=user, **mach_data)
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {len(machinery_data)} machinery'))

        # 7. CREATE MACHINERY ACTIVITIES
        self.stdout.write('Creating machinery activities...')
        machinery_list = list(Machinery.objects.filter(user=user))
        activities_count = 0
        for mach in machinery_list:
            activities = [
                {'Activity_date': datetime(2024, 11, 10).date(), 'Activity_type': 'Usage', 'Activity_cost': 1200, 'Description': 'Field plowing - 6 hours'},
                {'Activity_date': datetime(2024, 11, 15).date(), 'Activity_type': 'Maintenance', 'Activity_cost': 2500, 'Description': 'Oil and filter change'},
                {'Activity_date': datetime(2024, 11, 20).date(), 'Activity_type': 'Inspection', 'Activity_cost': 0, 'Description': 'General check-up'},
            ]
            for act in activities:
                Machinery_activities.objects.create(machinery=mach, **act)
                activities_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {activities_count} machinery activities'))

        # 8. CREATE MACHINERY MAINTENANCE
        self.stdout.write('Creating machinery maintenance...')
        maintenance_count = 0
        for mach in machinery_list:
            maintenance = [
                {'Date': datetime(2024, 10, 15).date(), 'Machinery_part': 'Engine Oil', 'Technician_details': 'Rajesh Sharma - 9876543210', 'Cost': 800, 'Description': 'Regular oil change'},
                {'Date': datetime(2024, 10, 28).date(), 'Machinery_part': 'Air Filter', 'Technician_details': 'Vikram - 9876543213', 'Cost': 500, 'Description': 'Filter replacement'},
                {'Date': datetime(2024, 11, 12).date(), 'Machinery_part': 'Spark Plugs', 'Technician_details': 'Service Center', 'Cost': 1200, 'Description': 'Spark plug set replacement'},
            ]
            for maint in maintenance:
                Machinery_maintenance.objects.create(machinery=mach, **maint)
                maintenance_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {maintenance_count} maintenance records'))

        # 9. CREATE LIVESTOCK
        self.stdout.write('Creating livestock...')
        livestock_data = [
            {'Tag_number': 'COW001', 'Animal_type': 'Cow', 'Age': 5, 'Breed': 'Holstein-Friesian'},
            {'Tag_number': 'COW002', 'Animal_type': 'Cow', 'Age': 4, 'Breed': 'Holstein-Friesian'},
            {'Tag_number': 'BUF001', 'Animal_type': 'Buffalo', 'Age': 4, 'Breed': 'Murrah'},
            {'Tag_number': 'GOT001', 'Animal_type': 'Goat', 'Age': 2, 'Breed': 'Jamunapari'},
            {'Tag_number': 'HEN001', 'Animal_type': 'Poultry', 'Age': 1, 'Breed': 'Kadaknath'},
        ]
        for live_data in livestock_data:
            Livestock.objects.create(user=user, **live_data)
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {len(livestock_data)} livestock'))

        # 10. CREATE LIVESTOCK PRODUCTION
        self.stdout.write('Creating livestock production...')
        livestock_list = list(Livestock.objects.filter(user=user))
        production_count = 0
        for livestock in livestock_list:
            for i in range(15):  # 15 days of production
                prod_date = datetime(2024, 11, 1).date() + timedelta(days=i)
                Livestock_production.objects.create(
                    livestock=livestock,
                    Production_date=prod_date,
                    Production_amount=str(random.randint(15, 25)),
                    Feed_consumed=Decimal(str(random.uniform(20, 30))),
                    Comments=f'Normal production for {livestock.Animal_type}'
                )
                production_count += 1
        self.stdout.write(self.style.SUCCESS(f'  ✓ Created {production_count} livestock production records'))

        # 11. CREATE MILK PRODUCTION
        self.stdout.write('Creating milk production...')
        for i in range(30):  # 30 days
            prod_date = datetime(2024, 11, 1).date() + timedelta(days=i)
            Milk_production.objects.create(
                user=user,
                Year=prod_date.year,
                Month=prod_date.month,
                Day=prod_date.day,
                Livestock_number=random.randint(2, 4),
                Morning_production=Decimal(str(random.uniform(20, 25))),
                Midday_production=Decimal(str(random.uniform(15, 20))),
                Evening_production=Decimal(str(random.uniform(18, 23))),
                Morning_consumption=Decimal(str(random.uniform(20, 25))),
                Evening_consumption=Decimal(str(random.uniform(18, 22)))
            )
        self.stdout.write(self.style.SUCCESS('  ✓ Created 30 milk production records'))

        # 12. CREATE EGGS PRODUCTION
        self.stdout.write('Creating eggs production...')
        for i in range(30):  # 30 days
            prod_date = datetime(2024, 11, 1).date() + timedelta(days=i)
            Eggs_production.objects.create(
                user=user,
                Year=prod_date.year,
                Month=prod_date.month,
                Day=prod_date.day,
                Poultry_number=random.randint(40, 55),
                Morning_egg_collection=Decimal(str(random.randint(30, 40))),
                Midday_egg_collection=Decimal(str(random.randint(20, 30))),
                Evening_egg_collection=Decimal(str(random.randint(15, 25))),
                Morning_feeds=Decimal(str(random.uniform(10, 15))),
                Evening_feeds=Decimal(str(random.uniform(8, 12))),
                Comments='Daily egg collection'
            )
        self.stdout.write(self.style.SUCCESS('  ✓ Created 30 eggs production records'))

        self.stdout.write(self.style.SUCCESS('\n✅ All dummy data populated successfully for user1!'))
        self.stdout.write(self.style.SUCCESS('\nData Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  - Employees: 5'))
        self.stdout.write(self.style.SUCCESS(f'  - Crops: 3 (with expenses, operations, sales)'))
        self.stdout.write(self.style.SUCCESS(f'  - Machinery: 3 (with activities and maintenance)'))
        self.stdout.write(self.style.SUCCESS(f'  - Livestock: 5 (with 15-day production history)'))
        self.stdout.write(self.style.SUCCESS(f'  - Milk Production: 30 days'))
        self.stdout.write(self.style.SUCCESS(f'  - Eggs Production: 30 days'))
        self.stdout.write(self.style.SUCCESS(f'\nNow your project looks fully used! 🎉'))

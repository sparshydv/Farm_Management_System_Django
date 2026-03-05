from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api_views import (
    CropExpensesViewSet,
    CropOperationsViewSet,
    CropSalesViewSet,
    CropsViewSet,
    EggsProductionViewSet,
    EmployeesViewSet,
    LivestockProductionViewSet,
    LivestockViewSet,
    MachineryActivitiesViewSet,
    MachineryMaintenanceViewSet,
    MachineryViewSet,
    MilkProductionViewSet,
    egg_monthly_summary,
    milk_monthly_summary,
)

router = DefaultRouter()
router.register(r"employees", EmployeesViewSet, basename="api-employees")
router.register(r"crops", CropsViewSet, basename="api-crops")
router.register(r"machinery", MachineryViewSet, basename="api-machinery")
router.register(r"livestock", LivestockViewSet, basename="api-livestock")
router.register(r"milk-production", MilkProductionViewSet, basename="api-milk-production")
router.register(r"egg-production", EggsProductionViewSet, basename="api-egg-production")

urlpatterns = [
    path("milk-production/summary/", milk_monthly_summary, name="api-milk-summary"),
    path("egg-production/summary/", egg_monthly_summary, name="api-egg-summary"),
    path("", include(router.urls)),
    path(
        "crops/<int:Cid>/expenses/",
        CropExpensesViewSet.as_view({"get": "list", "post": "create"}),
        name="api-crop-expenses-list",
    ),
    path(
        "crops/<int:Cid>/expenses/<int:pk>/",
        CropExpensesViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-crop-expenses-detail",
    ),
    path(
        "crops/<int:Cid>/sales/",
        CropSalesViewSet.as_view({"get": "list", "post": "create"}),
        name="api-crop-sales-list",
    ),
    path(
        "crops/<int:Cid>/sales/<int:pk>/",
        CropSalesViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-crop-sales-detail",
    ),
    path(
        "crops/<int:Cid>/operations/",
        CropOperationsViewSet.as_view({"get": "list", "post": "create"}),
        name="api-crop-operations-list",
    ),
    path(
        "crops/<int:Cid>/operations/<int:pk>/",
        CropOperationsViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-crop-operations-detail",
    ),
    path(
        "machinery/<str:Number_plate>/activities/",
        MachineryActivitiesViewSet.as_view({"get": "list", "post": "create"}),
        name="api-machinery-activities-list",
    ),
    path(
        "machinery/<str:Number_plate>/activities/<int:pk>/",
        MachineryActivitiesViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-machinery-activities-detail",
    ),
    path(
        "machinery/<str:Number_plate>/maintenance/",
        MachineryMaintenanceViewSet.as_view({"get": "list", "post": "create"}),
        name="api-machinery-maintenance-list",
    ),
    path(
        "machinery/<str:Number_plate>/maintenance/<int:pk>/",
        MachineryMaintenanceViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-machinery-maintenance-detail",
    ),
    path(
        "livestock/<str:Tag_number>/production/",
        LivestockProductionViewSet.as_view({"get": "list", "post": "create"}),
        name="api-livestock-production-list",
    ),
    path(
        "livestock/<str:Tag_number>/production/<int:pk>/",
        LivestockProductionViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="api-livestock-production-detail",
    ),
]

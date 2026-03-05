// ─── Auth ────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  display_name?: string;
  avatar_url?: string | null;
}

// ─── Employees ───────────────────────
export interface Employee {
  Eid: number;
  user: number;
  Name: string;
  Country_code: string;
  Phone_number: string;
  Position: string;
  Salary: number;
  Performance: string;
}

// ─── Crops ───────────────────────────
export interface Crop {
  Cid: number;
  user: number;
  Field_name: string;
  Field_description: string;
  Crop_name: string;
  Variety: string;
  Planting_date: string;
  Is_harvested: boolean;
  Harvesting_date: string | null;
}

export interface CropExpense {
  id: number;
  crops: number;
  Expense_date: string;
  Expense_type: string;
  Expense_description: string;
  Budget: string;
  Expense_amount: string;
  Supplier: string;
  Payment_method: string;
  Receipt_number: string;
}

export interface CropSale {
  id: number;
  crops: number;
  Sale_date: string;
  Quantity_sold: string;
  Unit_price: string;
  Total_price: string;
  Buyer_information: string;
  Payment_method: string;
  Payment_status: string;
  Invoice_number: string;
  Additional_notes: string;
}

export interface CropOperation {
  id: number;
  crops: number;
  Operation_date: string;
  Operation_name: string;
  Additional_notes: string;
}

// ─── Machinery ───────────────────────
export interface Machinery {
  Number_plate: string;
  user: number;
  Equipment_name: string;
  Purchase_price: string;
  Purchase_date: string;
  Operation: string;
}

export interface MachineryActivity {
  id: number;
  machinery: string;
  Activity_date: string;
  Activity_type: string;
  Activity_cost: number;
  Description: string;
}

export interface MachineryMaintenance {
  id: number;
  machinery: string;
  Date: string;
  Machinery_part: string;
  Technician_details: string;
  Cost: number;
  Description: string;
}

// ─── Livestock ───────────────────────
export interface Livestock {
  Tag_number: string;
  user: number;
  Animal_type: string;
  Age: number;
  Breed: string;
}

export interface LivestockProduction {
  id: number;
  livestock: string;
  Production_date: string;
  Production_amount: string;
  Feed_consumed: string;
  Comments: string | null;
}

// ─── Production ──────────────────────
export interface MilkProduction {
  id: number;
  user: number;
  Year: number;
  Month: number;
  Day: number;
  Livestock_number: number;
  Morning_production: string;
  Midday_production: string;
  Evening_production: string;
  Total_production: string;
  Morning_consumption: string;
  Evening_consumption: string;
  Total_consumption: string;
}

export interface EggProduction {
  id: number;
  user: number;
  Year: number;
  Month: number;
  Day: number;
  Poultry_number: number;
  Morning_egg_collection: string;
  Midday_egg_collection: string;
  Evening_egg_collection: string;
  Total_egg_collection: string;
  Morning_feeds: string;
  Evening_feeds: string;
  Total_feeds: string;
  Comments: string | null;
}

export interface ProductionSummary {
  count: number;
  total_production?: number;
  total_consumption?: number;
  total_egg_collection?: number;
  total_feeds?: number;
}


export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string; // Only for initial setup, not stored securely in this demo
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: StockMovementType;
  quantity: number;
  date: string; // ISO date string
  notes?: string;
  supplier?: string; // For Stock IN
  reason?: string; // For Stock OUT
}

export interface InventoryItem {
  item: Item;
  category: Category;
  quantity: number;
}

export enum Page {
  Login = 'Login',
  Dashboard = 'Dashboard',
  StockIn = 'StockIn',
  StockOut = 'StockOut',
  ManageItems = 'ManageItems', // Can be combined with categories
  ManageCategories = 'ManageCategories',
  ManageUsers = 'ManageUsers',
  Reports = 'Reports', // For Excel export view
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export interface ItemWithStock extends Item {
  currentStock: number;
}

export interface CategoryWithItemCount extends Category {
  itemCount: number;
}

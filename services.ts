
import { Item, Category, StockMovement, StockMovementType, User, UserRole, InventoryItem } from './types';
// SheetJS is globally available from CDN script in index.html
declare var XLSX: any; 

// --- Stock Service ---

export const calculateInventory = (items: Item[], categories: Category[], movements: StockMovement[]): InventoryItem[] => {
  const inventoryMap = new Map<string, { item: Item, category: Category, quantity: number }>();

  items.forEach(item => {
    const category = categories.find(c => c.id === item.categoryId) || { id: 'unknown', name: 'Unknown Category' };
    inventoryMap.set(item.id, { item, category, quantity: 0 });
  });

  movements.forEach(movement => {
    const entry = inventoryMap.get(movement.itemId);
    if (entry) {
      if (movement.type === StockMovementType.IN) {
        entry.quantity += movement.quantity;
      } else if (movement.type === StockMovementType.OUT) {
        entry.quantity -= movement.quantity;
      }
      inventoryMap.set(movement.itemId, entry);
    }
  });
  return Array.from(inventoryMap.values()).filter(inv => inv.item != null);
};

export const getItemCurrentStock = (itemId: string, movements: StockMovement[]): number => {
  let currentStock = 0;
  movements
    .filter(m => m.itemId === itemId)
    .forEach(m => {
      if (m.type === StockMovementType.IN) {
        currentStock += m.quantity;
      } else {
        currentStock -= m.quantity;
      }
    });
  return currentStock;
};


// --- User Service ---
// (Primarily for this frontend demo, real user management is backend)
export const authenticateUser = (username: string, passwordToCheck: string, users: User[]): User | null => {
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (user && user.password === passwordToCheck) { // In a real app, hash passwords!
    return user;
  }
  return null;
};

// --- Export Service ---
export const exportInventoryToExcel = (inventory: InventoryItem[], fileName: string = 'inventory_report.xlsx'): void => {
  const worksheetData = inventory.map(invItem => ({
    'ឈ្មោះសម្ភារៈ (Item Name)': invItem.item.name,
    'ប្រភេទ (Category)': invItem.category.name,
    'បរិមាណ (Quantity)': invItem.quantity,
    'ការពិពណ៌នា (Description)': invItem.item.description || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
  XLSX.writeFile(workbook, fileName);
};

export const exportStockMovementsToExcel = (
  movements: StockMovement[], 
  items: Item[], 
  categories: Category[], 
  fileName: string = 'stock_movements.xlsx'
): void => {
  const itemsMap = new Map(items.map(i => [i.id, i]));
  const categoriesMap = new Map(categories.map(c => [c.id, c]));

  const worksheetData = movements.map(movement => {
    const item = itemsMap.get(movement.itemId);
    const category = item ? categoriesMap.get(item.categoryId) : undefined;
    return {
      'កាលបរិច្ឆេទ (Date)': new Date(movement.date).toLocaleDateString('km-KH'),
      'សម្ភារៈ (Item)': item?.name || 'N/A',
      'ប្រភេទ (Category)': category?.name || 'N/A',
      'ប្រភេទចលនា (Movement Type)': movement.type === StockMovementType.IN ? 'ស្តុកចូល (IN)' : 'ស្តុកចេញ (OUT)',
      'បរិមាណ (Quantity)': movement.quantity,
      'អ្នកផ្គត់ផ្គង់ (Supplier)': movement.supplier || '',
      'មូលហេតុ (Reason)': movement.reason || '',
      'កំណត់ចំណាំ (Notes)': movement.notes || '',
    };
  });
  
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Movements');
  XLSX.writeFile(workbook, fileName);
};

// Helper to generate unique IDs (simple version for demo)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
    

import React from 'react'; // Required for React.FC, React.ReactNode etc. Explicit import is fine.
import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import { User, UserRole, Category, Item, StockMovement, StockMovementType, Page, InventoryItem, SelectOption, ItemWithStock, CategoryWithItemCount } from './types';
import { KHMER_TEXTS, APP_TITLE, DEFAULT_USERS, INITIAL_CATEGORIES, INITIAL_ITEMS, NavItems, LogoutIcon, HomeIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, UsersIcon, DocumentTextIcon, TagIcon, CubeIcon, PlusCircleIcon } from './constants';
import { useLocalStorage } from './hooks';
import { Button, Input, Select, Modal, Card, Table, Textarea, Toast } from './uiComponents';
import { calculateInventory, getItemCurrentStock, authenticateUser, exportInventoryToExcel, exportStockMovementsToExcel, generateId } from './services';

// Helper function to format date for display
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });

// -------- LOGIN PAGE --------
interface LoginPageProps {
  onLogin: (user: User) => void;
  users: User[];
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users.length > 0 ? users[0].id : '');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) {
        setError("សូមជ្រើសរើសអ្នកប្រើប្រាស់");
        return;
    }
    const authenticatedUser = authenticateUser(selectedUser.username, password, users);
    if (authenticatedUser) {
      onLogin(authenticatedUser);
    } else {
      setError('ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
    }
  };

  const userOptions: SelectOption[] = users.map(u => ({ value: u.id, label: u.username }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <Card title={KHMER_TEXTS.login.title} className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <Select
            label={KHMER_TEXTS.login.selectUser}
            options={userOptions}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          <Input
            label={KHMER_TEXTS.login.passwordLabel}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" variant="primary" size="lg">
            {KHMER_TEXTS.login.loginButton}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// -------- DASHBOARD PAGE --------
interface DashboardPageProps {
  items: Item[];
  categories: Category[];
  stockMovements: StockMovement[];
}
const DashboardPage: React.FC<DashboardPageProps> = ({ items, categories, stockMovements }) => {
  const inventory = calculateInventory(items, categories, stockMovements);
  const totalUniqueItems = items.length;
  const totalStockQuantity = inventory.reduce((sum, invItem) => sum + invItem.quantity, 0);

  const recentStockIns = stockMovements
    .filter(m => m.type === StockMovementType.IN)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentStockOuts = stockMovements
    .filter(m => m.type === StockMovementType.OUT)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getItemName = (itemId: string) => items.find(i => i.id === itemId)?.name || KHMER_TEXTS.common.loading;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{KHMER_TEXTS.dashboard.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={KHMER_TEXTS.dashboard.totalItems} className="text-center">
          <p className="text-4xl font-bold text-blue-600">{totalUniqueItems}</p>
        </Card>
        <Card title={KHMER_TEXTS.dashboard.totalStockQuantity} className="text-center">
          <p className="text-4xl font-bold text-green-600">{totalStockQuantity}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={KHMER_TEXTS.dashboard.recentStockIn}>
          {recentStockIns.length > 0 ? (
            <ul className="space-y-3">
              {recentStockIns.map(m => (
                <li key={m.id} className="p-3 bg-gray-50 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{getItemName(m.itemId)}</span>
                    <span className="text-green-600 font-semibold">+{m.quantity}</span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(m.date)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">{KHMER_TEXTS.dashboard.noRecentActivity}</p>}
        </Card>
        <Card title={KHMER_TEXTS.dashboard.recentStockOut}>
          {recentStockOuts.length > 0 ? (
            <ul className="space-y-3">
              {recentStockOuts.map(m => (
                <li key={m.id} className="p-3 bg-gray-50 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{getItemName(m.itemId)}</span>
                    <span className="text-red-600 font-semibold">-{m.quantity}</span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(m.date)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">{KHMER_TEXTS.dashboard.noRecentActivity}</p>}
        </Card>
      </div>
       <Card title={KHMER_TEXTS.dashboard.currentInventory}>
          <Table
            columns={[
              { key: 'item', header: KHMER_TEXTS.dashboard.item, render: (inv: InventoryItem) => inv.item.name },
              { key: 'category', header: KHMER_TEXTS.dashboard.category, render: (inv: InventoryItem) => inv.category.name },
              { key: 'quantity', header: KHMER_TEXTS.dashboard.quantity, render: (inv: InventoryItem) => <span className={inv.quantity > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{inv.quantity}</span> },
            ]}
            data={inventory.sort((a,b) => a.item.name.localeCompare(b.item.name))}
            getKey={(inv: InventoryItem) => inv.item.id}
          />
        </Card>
    </div>
  );
};

// -------- STOCK IN PAGE --------
interface StockInPageProps {
  items: Item[];
  categories: Category[];
  onAddStockIn: (movement: StockMovement) => void;
  onAddItem: (item: Item) => void;
  onAddCategory: (category: Category) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const StockInPage: React.FC<StockInPageProps> = ({ items, categories, onAddStockIn, onAddItem, onAddCategory, showToast }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  const [quantity, setQuantity] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [supplier, setSupplier] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const itemOptions: SelectOption[] = [{ value: '', label: KHMER_TEXTS.stockIn.selectItem }, ...items.map(i => ({ value: i.id, label: i.name }))];
  const categoryOptions: SelectOption[] = [{ value: '', label: KHMER_TEXTS.stockIn.selectCategory }, ...categories.map(c => ({ value: c.id, label: c.name }))];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let finalItemId = selectedItemId;
    let finalCategoryId = selectedCategoryId;

    if (isNewItem) {
      if (!newItemName.trim()) {
        showToast("សូមបញ្ចូលឈ្មោះសម្ភារៈថ្មី", "error");
        return;
      }
      if (isNewCategory) {
        if (!newCategoryName.trim()) {
          showToast("សូមបញ្ចូលឈ្មោះប្រភេទថ្មី", "error");
          return;
        }
        const newCatId = generateId();
        onAddCategory({ id: newCatId, name: newCategoryName.trim() });
        finalCategoryId = newCatId;
      } else if (!selectedCategoryId) {
         showToast("សូមជ្រើសរើសប្រភេទសម្រាប់សម្ភារៈថ្មី", "error");
        return;
      }
      
      const newItemId = generateId();
      onAddItem({ id: newItemId, name: newItemName.trim(), categoryId: finalCategoryId, description: newItemDescription.trim() });
      finalItemId = newItemId;
    } else if (!selectedItemId) {
      showToast("សូមជ្រើសរើសសម្ភារៈ", "error");
      return;
    }
    
    if (!finalItemId) { // Should not happen if logic is correct
        showToast("មានបញ្ហាក្នុងការកំណត់សម្ភារៈ", "error");
        return;
    }

    const movement: StockMovement = {
      id: generateId(),
      itemId: finalItemId,
      type: StockMovementType.IN,
      quantity,
      date,
      supplier: supplier.trim(),
      notes: notes.trim(),
    };
    onAddStockIn(movement);
    showToast(KHMER_TEXTS.stockIn.successMessage, 'success');
    // Reset form
    setSelectedItemId(''); setIsNewItem(false); setNewItemName(''); setNewItemDescription('');
    setSelectedCategoryId(''); setIsNewCategory(false); setNewCategoryName('');
    setQuantity(1); setSupplier(''); setNotes('');
  };
  
  useEffect(() => {
    if(!isNewItem && selectedItemId) {
        const item = items.find(i => i.id === selectedItemId);
        if(item) setSelectedCategoryId(item.categoryId);
    } else if (isNewItem) {
        // When switching to new item, if a category was selected for an existing item, clear it unless user wants new category.
        // This depends on desired UX. For now, we keep it simple.
    }
  }, [isNewItem, selectedItemId, items]);


  return (
    <Card title={KHMER_TEXTS.stockIn.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-end space-x-2">
            <div className="flex-grow">
                <Select
                    label={KHMER_TEXTS.stockIn.itemLabel}
                    options={itemOptions}
                    value={selectedItemId}
                    onChange={(e) => { setSelectedItemId(e.target.value); setIsNewItem(false); }}
                    disabled={isNewItem}
                />
            </div>
            <Button type="button" variant="secondary" onClick={() => { setIsNewItem(prev => !prev); setSelectedItemId(''); }}>
                {isNewItem ? KHMER_TEXTS.common.cancel : KHMER_TEXTS.stockIn.newItemLabel}
            </Button>
        </div>

        {isNewItem && (
          <div className="p-3 border rounded-md bg-gray-50 space-y-3">
            <Input
              label={KHMER_TEXTS.stockIn.newItemLabel}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="ឧ. ម៉ាស៊ីនព្រីន Canon"
            />
            <Textarea
              label={KHMER_TEXTS.manageItems.itemDescriptionLabel}
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="ការពិពណ៌នាលម្អិតអំពីសម្ភារៈ"
            />
             <div className="flex items-end space-x-2">
                <div className="flex-grow">
                    <Select
                        label={KHMER_TEXTS.stockIn.categoryLabel}
                        options={categoryOptions}
                        value={selectedCategoryId}
                        onChange={(e) => { setSelectedCategoryId(e.target.value); setIsNewCategory(false); }}
                        disabled={isNewCategory}
                    />
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => { setIsNewCategory(prev => !prev); setSelectedCategoryId(''); }}>
                     {isNewCategory ? KHMER_TEXTS.common.cancel : KHMER_TEXTS.stockIn.newCategoryLabel}
                </Button>
            </div>
            {isNewCategory && (
                 <Input
                    label={KHMER_TEXTS.stockIn.newCategoryLabel}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="ឧ. សម្ភារៈផ្ទះបាយ"
                />
            )}
          </div>
        )}
        
        {!isNewItem && selectedItemId && (
             <Input
                label={KHMER_TEXTS.stockIn.categoryLabel}
                value={categories.find(c=>c.id === items.find(i=>i.id === selectedItemId)?.categoryId)?.name || ''}
                disabled
            />
        )}

        <Input
          label={KHMER_TEXTS.stockIn.quantityLabel}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
          min="1"
          required
        />
        <Input
          label={KHMER_TEXTS.stockIn.dateLabel}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label={KHMER_TEXTS.stockIn.supplierLabel}
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
        <Textarea
          label={KHMER_TEXTS.stockIn.notesLabel}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" variant="primary">{KHMER_TEXTS.stockIn.addButton}</Button>
      </form>
    </Card>
  );
};

// -------- STOCK OUT PAGE --------
interface StockOutPageProps {
  items: Item[];
  stockMovements: StockMovement[];
  onAddStockOut: (movement: StockMovement) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const StockOutPage: React.FC<StockOutPageProps> = ({ items, stockMovements, onAddStockOut, showToast }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const availableItems = items.filter(item => getItemCurrentStock(item.id, stockMovements) > 0);
  const itemOptions: SelectOption[] = [{ value: '', label: KHMER_TEXTS.stockOut.selectItem }, ...availableItems.map(i => ({ value: i.id, label: `${i.name} (${KHMER_TEXTS.stockOut.availableQuantity}: ${getItemCurrentStock(i.id, stockMovements)})` }))];
  
  const currentStock = selectedItemId ? getItemCurrentStock(selectedItemId, stockMovements) : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
        showToast("សូមជ្រើសរើសសម្ភារៈ", "error");
        return;
    }
    if (quantity > currentStock) {
      showToast(KHMER_TEXTS.stockOut.insufficientStock, 'error');
      return;
    }
    const movement: StockMovement = {
      id: generateId(),
      itemId: selectedItemId,
      type: StockMovementType.OUT,
      quantity,
      date,
      reason: reason.trim(),
      notes: notes.trim(),
    };
    onAddStockOut(movement);
    showToast(KHMER_TEXTS.stockOut.successMessage, 'success');
    // Reset form
    setSelectedItemId('');
    setQuantity(1);
    setReason('');
    setNotes('');
  };

  return (
    <Card title={KHMER_TEXTS.stockOut.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label={KHMER_TEXTS.stockOut.itemLabel}
          options={itemOptions}
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          required
        />
        {selectedItemId && <p className="text-sm text-gray-600">{KHMER_TEXTS.stockOut.availableQuantity}: {currentStock}</p>}
        <Input
          label={KHMER_TEXTS.stockOut.quantityLabel}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
          min="1"
          max={currentStock > 0 ? currentStock : undefined}
          required
          disabled={!selectedItemId}
        />
        <Input
          label={KHMER_TEXTS.stockOut.dateLabel}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label={KHMER_TEXTS.stockOut.reasonLabel}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Textarea
          label={KHMER_TEXTS.stockOut.notesLabel}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" variant="primary" disabled={!selectedItemId || currentStock === 0}>{KHMER_TEXTS.stockOut.addButton}</Button>
      </form>
    </Card>
  );
};


// -------- MANAGE ITEMS PAGE --------
interface ManageItemsPageProps {
  items: Item[];
  categories: Category[];
  stockMovements: StockMovement[];
  onAddItem: (item: Item) => void;
  onUpdateItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ManageItemsPage: React.FC<ManageItemsPageProps> = ({ items, categories, stockMovements, onAddItem, onUpdateItem, onDeleteItem, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories.length > 0 ? categories[0].id : '');
  
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const categoryOptions: SelectOption[] = categories.map(c => ({ value: c.id, label: c.name }));

  const openModal = (item: Item | null = null) => {
    setEditingItem(item);
    setItemName(item ? item.name : '');
    setItemDescription(item ? item.description || '' : '');
    setSelectedCategoryId(item ? item.categoryId : (categories.length > 0 ? categories[0].id : ''));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    if (!itemName.trim() || !selectedCategoryId) {
        showToast("ឈ្មោះសម្ភារៈ និងប្រភេទមិនអាចទទេបានទេ។", "error");
        return;
    }
    if (editingItem) {
      onUpdateItem({ ...editingItem, name: itemName.trim(), description: itemDescription.trim(), categoryId: selectedCategoryId });
      showToast(KHMER_TEXTS.manageItems.itemUpdated, 'success');
    } else {
      onAddItem({ id: generateId(), name: itemName.trim(), description: itemDescription.trim(), categoryId: selectedCategoryId });
      showToast(KHMER_TEXTS.manageItems.itemAdded, 'success');
    }
    closeModal();
  };
  
  const openConfirmDeleteModal = (item: Item) => { // Parameter type is Item, compatible with ItemWithStock
    setItemToDelete(item);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setItemToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (itemToDelete) {
      // Check if item is used in stock movements
      const isUsed = stockMovements.some(m => m.itemId === itemToDelete.id);
      if (isUsed) {
        showToast("មិនអាចលុបសម្ភារៈនេះបានទេ ព្រោះវាមានក្នុងចលនាស្តុកហើយ។", "error");
      } else {
        onDeleteItem(itemToDelete.id);
        showToast(KHMER_TEXTS.manageItems.itemDeleted, 'success');
      }
      closeConfirmDeleteModal();
    }
  };


  const inventory = calculateInventory(items, categories, stockMovements);
  const itemsWithStock: ItemWithStock[] = items.map(item => {
    const inv = inventory.find(i => i.item.id === item.id);
    return { ...item, currentStock: inv ? inv.quantity : 0 };
  });


  return (
    <Card title={KHMER_TEXTS.manageItems.title} actions={<Button onClick={() => openModal()} leftIcon={<PlusCircleIcon />}>{KHMER_TEXTS.manageItems.addItem}</Button>}>
      {items.length === 0 ? (
        <p className="text-gray-500">{KHMER_TEXTS.manageItems.noItems}</p>
      ) : (
        <Table
          columns={[
            { key: 'name', header: KHMER_TEXTS.common.name },
            { key: 'categoryId', header: KHMER_TEXTS.manageItems.categoryLabel, render: (item: ItemWithStock) => categories.find(c => c.id === item.categoryId)?.name || 'N/A' },
            { key: 'description', header: KHMER_TEXTS.common.description, render: (item: ItemWithStock) => item.description || '-' },
            { key: 'currentStock', header: KHMER_TEXTS.dashboard.quantity, render: (item: ItemWithStock) => <span className={item.currentStock > 0 ? 'text-green-600' : 'text-red-600'}>{item.currentStock}</span> },
          ]}
          data={itemsWithStock.sort((a,b)=>a.name.localeCompare(b.name))}
          getKey={(item: ItemWithStock) => item.id}
          onEdit={openModal} // openModal expects Item | null, ItemWithStock is compatible
          onDelete={openConfirmDeleteModal} // openConfirmDeleteModal expects Item | null
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? KHMER_TEXTS.common.edit : KHMER_TEXTS.manageItems.addItem}>
        <div className="space-y-4">
          <Input label={KHMER_TEXTS.manageItems.itemNameLabel} value={itemName} onChange={e => setItemName(e.target.value)} required />
          <Textarea label={KHMER_TEXTS.manageItems.itemDescriptionLabel} value={itemDescription} onChange={e => setItemDescription(e.target.value)} />
          <Select label={KHMER_TEXTS.manageItems.categoryLabel} options={categoryOptions} value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} required/>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleSaveItem}>{KHMER_TEXTS.common.save}</Button>
        </div>
      </Modal>
      
      <Modal isOpen={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal} title={KHMER_TEXTS.common.confirm +" "+ KHMER_TEXTS.common.delete}>
        <p>{KHMER_TEXTS.manageItems.confirmDelete} "{itemToDelete?.name}"?</p>
         {stockMovements.some(m => m.itemId === itemToDelete?.id) && <p className="text-red-500 text-sm mt-2">សម្ភារៈនេះមានក្នុងចលនាស្តុករួចហើយ។ ការលុបអាចប៉ះពាល់ដល់របាយការណ៍។</p>}
        <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeConfirmDeleteModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleDeleteConfirmed} variant="danger">{KHMER_TEXTS.common.delete}</Button>
        </div>
      </Modal>
    </Card>
  );
};

// -------- MANAGE CATEGORIES PAGE --------
interface ManageCategoriesPageProps {
  categories: Category[];
  items: Item[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ categories, items, onAddCategory, onUpdateCategory, onDeleteCategory, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
        showToast("ឈ្មោះប្រភេទមិនអាចទទេបានទេ។", "error");
        return;
    }
    if (editingCategory) {
      onUpdateCategory({ ...editingCategory, name: categoryName.trim() });
      showToast(KHMER_TEXTS.manageCategories.categoryUpdated, 'success');
    } else {
      onAddCategory({ id: generateId(), name: categoryName.trim() });
      showToast(KHMER_TEXTS.manageCategories.categoryAdded, 'success');
    }
    closeModal();
  };

  const openConfirmDeleteModal = (category: Category) => { // Parameter type is Category, compatible with CategoryWithItemCount
    setCategoryToDelete(category);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setCategoryToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (categoryToDelete) {
      const itemsInCategory = items.filter(item => item.categoryId === categoryToDelete.id);
      if (itemsInCategory.length > 0) {
        showToast("មិនអាចលុបប្រភេទនេះបានទេ ព្រោះមានសម្ភារៈចំណុះក្នុងប្រភេទនេះ។", "error");
      } else {
        onDeleteCategory(categoryToDelete.id);
        showToast(KHMER_TEXTS.manageCategories.categoryDeleted, 'success');
      }
      closeConfirmDeleteModal();
    }
  };
  
  const categoriesWithItemCount: CategoryWithItemCount[] = categories.map(cat => ({
    ...cat,
    itemCount: items.filter(item => item.categoryId === cat.id).length
  }));

  return (
    <Card title={KHMER_TEXTS.manageCategories.title} actions={<Button onClick={() => openModal()} leftIcon={<PlusCircleIcon />}>{KHMER_TEXTS.manageCategories.addCategory}</Button>}>
      {categories.length === 0 ? (
        <p className="text-gray-500">{KHMER_TEXTS.manageCategories.noCategories}</p>
      ) : (
        <Table
          columns={[
            { key: 'name', header: KHMER_TEXTS.common.name },
            { key: 'itemCount', header: 'ចំនួនសម្ភារៈ', render: (cat: CategoryWithItemCount) => cat.itemCount },
          ]}
          data={categoriesWithItemCount.sort((a,b)=>a.name.localeCompare(b.name))}
          getKey={(category: CategoryWithItemCount) => category.id}
          onEdit={openModal} // openModal expects Category | null
          onDelete={openConfirmDeleteModal} // openConfirmDeleteModal expects Category | null
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCategory ? KHMER_TEXTS.common.edit : KHMER_TEXTS.manageCategories.addCategory}>
        <Input label={KHMER_TEXTS.manageCategories.categoryNameLabel} value={categoryName} onChange={e => setCategoryName(e.target.value)} required />
        <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleSaveCategory}>{KHMER_TEXTS.common.save}</Button>
        </div>
      </Modal>
      <Modal isOpen={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal} title={KHMER_TEXTS.common.confirm + " " + KHMER_TEXTS.common.delete}>
        <p>{KHMER_TEXTS.manageCategories.confirmDelete} "{categoryToDelete?.name}"?</p>
        {items.filter(item => item.categoryId === categoryToDelete?.id).length > 0 && <p className="text-red-500 text-sm mt-2">ប្រភេទនេះមានផ្ទុកសម្ភារៈ។ ការលុបនឹងធ្វើអោយសម្ភារៈទាំងនោះគ្មានប្រភេទ។</p>}
        <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeConfirmDeleteModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleDeleteConfirmed} variant="danger">{KHMER_TEXTS.common.delete}</Button>
        </div>
      </Modal>
    </Card>
  );
};


// -------- MANAGE USERS PAGE --------
interface ManageUsersPageProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void; // Simple update for demo
  onDeleteUser: (userId: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  currentUser: User | null;
}

const ManageUsersPage: React.FC<ManageUsersPageProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser, showToast, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.User);
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const roleOptions: SelectOption<UserRole>[] = [
    { value: UserRole.User, label: 'User' },
    { value: UserRole.Admin, label: 'Admin' },
  ];

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setUsername(user ? user.username : '');
    setPassword(''); // Always clear password for security/simplicity in demo
    setRole(user ? user.role : UserRole.User);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    if (!username.trim()) {
        showToast("ឈ្មោះអ្នកប្រើប្រាស់មិនអាចទទេបានទេ។", "error");
        return;
    }
    if (!editingUser && !password.trim()) { // Require password for new users
        showToast("ពាក្យសម្ងាត់មិនអាចទទេបានទេសម្រាប់អ្នកប្រើប្រាស់ថ្មី។", "error");
        return;
    }

    if (editingUser) {
      const updatedUser = { ...editingUser, username: username.trim(), role };
      // Only update password if provided, for simplicity. Real apps need secure password change flows.
      if (password.trim()) (updatedUser as any).password = password.trim(); 
      onUpdateUser(updatedUser);
      showToast(KHMER_TEXTS.manageUsers.userUpdated, 'success');
    } else {
      onAddUser({ id: generateId(), username: username.trim(), password: password.trim(), role });
      showToast(KHMER_TEXTS.manageUsers.userAdded, 'success');
    }
    closeModal();
  };

  const openConfirmDeleteModal = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      showToast("មិនអាចលុបគណនីផ្ទាល់ខ្លួនបានទេ។", "error");
      return;
    }
    setUserToDelete(user);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setUserToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      showToast(KHMER_TEXTS.manageUsers.userDeleted, 'success');
      closeConfirmDeleteModal();
    }
  };

  return (
    <Card title={KHMER_TEXTS.manageUsers.title} actions={<Button onClick={() => openModal()} leftIcon={<PlusCircleIcon />}>{KHMER_TEXTS.manageUsers.addUser}</Button>}>
      {users.length === 0 ? (
        <p>{KHMER_TEXTS.manageUsers.noUsers}</p>
      ) : (
        <Table
          columns={[
            { key: 'username', header: KHMER_TEXTS.manageUsers.usernameLabel },
            { key: 'role', header: KHMER_TEXTS.manageUsers.roleLabel },
          ]}
          data={users.sort((a,b) => a.username.localeCompare(b.username))}
          getKey={(user: User) => user.id}
          onEdit={openModal}
          onDelete={openConfirmDeleteModal}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? KHMER_TEXTS.common.edit : KHMER_TEXTS.manageUsers.addUser}>
        <div className="space-y-4">
            <Input label={KHMER_TEXTS.manageUsers.usernameLabel} value={username} onChange={e => setUsername(e.target.value)} required />
            <Input label={KHMER_TEXTS.manageUsers.passwordLabel} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={editingUser ? "ទុកឱ្យនៅទំនេរ ប្រសិនបើមិនចង់ផ្លាស់ប្តូរ" : ""} required={!editingUser} />
            <Select label={KHMER_TEXTS.manageUsers.roleLabel} options={roleOptions} value={role} onChange={e => setRole(e.target.value as UserRole)} />
        </div>
         <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleSaveUser}>{KHMER_TEXTS.common.save}</Button>
        </div>
      </Modal>
      <Modal isOpen={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal} title={KHMER_TEXTS.common.confirm + " " + KHMER_TEXTS.common.delete}>
        <p>{KHMER_TEXTS.manageUsers.confirmDelete} "{userToDelete?.username}"?</p>
        <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={closeConfirmDeleteModal} variant="secondary">{KHMER_TEXTS.common.cancel}</Button>
            <Button onClick={handleDeleteConfirmed} variant="danger">{KHMER_TEXTS.common.delete}</Button>
        </div>
      </Modal>
    </Card>
  );
};

// -------- REPORTS PAGE --------
interface ReportsPageProps {
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  items: Item[];
  categories: Category[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}
const ReportsPage: React.FC<ReportsPageProps> = ({ inventory, stockMovements, items, categories, showToast }) => {
  const handleExportInventory = () => {
    exportInventoryToExcel(inventory);
    showToast(KHMER_TEXTS.reports.exportSuccess, 'success');
  };
  const handleExportMovements = () => {
    exportStockMovementsToExcel(stockMovements, items, categories);
    showToast(KHMER_TEXTS.reports.exportSuccess, 'success');
  }

  return (
    <Card title={KHMER_TEXTS.reports.title}>
      <div className="space-y-4">
        <Button onClick={handleExportInventory} variant="primary" leftIcon={<DocumentTextIcon />}>
          {KHMER_TEXTS.reports.exportInventory}
        </Button>
        <Button onClick={handleExportMovements} variant="primary" leftIcon={<DocumentTextIcon />}>
          {KHMER_TEXTS.reports.exportStockMovements}
        </Button>
      </div>
    </Card>
  );
};

// -------- MAIN APP COMPONENT --------
const App: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('stock_users', DEFAULT_USERS);
  const [categories, setCategories] = useLocalStorage<Category[]>('stock_categories', INITIAL_CATEGORIES);
  const [items, setItems] = useLocalStorage<Item[]>('stock_items', INITIAL_ITEMS);
  const [stockMovements, setStockMovements] = useLocalStorage<StockMovement[]>('stock_movements', []);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };
  
  // Initialize with some data if empty for demo
  useEffect(() => {
    if (users.length === 0) setUsers(DEFAULT_USERS);
    if (categories.length === 0) setCategories(INITIAL_CATEGORIES);
    if (items.length === 0) setItems(INITIAL_ITEMS);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage(Page.Dashboard);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.Login);
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  // CRUD operations
  const addStockIn = (movement: StockMovement) => setStockMovements(prev => [...prev, movement]);
  const addStockOut = (movement: StockMovement) => setStockMovements(prev => [...prev, movement]);
  
  const addItem = (item: Item) => setItems(prev => [...prev, item]);
  const updateItem = (updatedItem: Item) => setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  const deleteItem = (itemId: string) => {
    // Also remove associated stock movements, or prevent deletion if movements exist.
    // For simplicity here, we'll prevent deletion if movements exist (handled in page)
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
  const updateCategory = (updatedCategory: Category) => setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  const deleteCategory = (categoryId: string) => {
     // Update items that belong to this category to have no category or a default one.
     // For simplicity, we'll prevent deletion if items exist in category (handled in page)
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    // setItems(prev => prev.map(item => item.categoryId === categoryId ? {...item, categoryId: ''} : item)); // Option: Unassign category
  };

  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const updateUser = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  const deleteUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));


  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }
  
  const currentInventory = calculateInventory(items, categories, stockMovements);
  const navItems = NavItems(currentUser.role);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <DashboardPage items={items} categories={categories} stockMovements={stockMovements} />;
      case Page.StockIn:
        return <StockInPage items={items} categories={categories} onAddStockIn={addStockIn} onAddItem={addItem} onAddCategory={addCategory} showToast={showToast} />;
      case Page.StockOut:
        return <StockOutPage items={items} stockMovements={stockMovements} onAddStockOut={addStockOut} showToast={showToast}/>;
      case Page.ManageItems:
        return <ManageItemsPage items={items} categories={categories} stockMovements={stockMovements} onAddItem={addItem} onUpdateItem={updateItem} onDeleteItem={deleteItem} showToast={showToast}/>;
      case Page.ManageCategories:
        return <ManageCategoriesPage categories={categories} items={items} onAddCategory={addCategory} onUpdateCategory={updateCategory} onDeleteCategory={deleteCategory} showToast={showToast}/>;
      case Page.ManageUsers:
        if (currentUser.role !== UserRole.Admin) return <p>Access Denied</p>;
        return <ManageUsersPage users={users} onAddUser={addUser} onUpdateUser={updateUser} onDeleteUser={deleteUser} showToast={showToast} currentUser={currentUser} />;
      case Page.Reports:
        return <ReportsPage inventory={currentInventory} stockMovements={stockMovements} items={items} categories={categories} showToast={showToast}/>;
      default:
        return <DashboardPage items={items} categories={categories} stockMovements={stockMovements} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block`}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">{APP_TITLE}</h2>
          <p className="text-sm text-gray-400">អ្នកប្រើប្រាស់: {currentUser.username} ({currentUser.role})</p>
        </div>
        <nav className="py-4">
          {navItems.map(nav => (
            <button
              key={nav.page}
              onClick={() => handleNavigation(nav.page)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${currentPage === nav.page ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              <nav.icon className="mr-3" />
              {nav.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <Button onClick={handleLogout} variant="danger" className="w-full" leftIcon={<LogoutIcon />}>
                {KHMER_TEXTS.navigation.logout}
            </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">{navItems.find(n=>n.page === currentPage)?.label || APP_TITLE}</h1>
           <div>{/* Placeholder for potential icons */}</div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderPage()}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;

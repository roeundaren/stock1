
import React from 'react';
import { UserRole, Page, User, Category, Item } from './types';

export const APP_TITLE = "ប្រព័ន្ធគ្រប់គ្រងស្តុកសម្ភារៈ";

export const KHMER_TEXTS = {
  login: {
    title: "ចូលប្រើប្រព័ន្ធ",
    usernameLabel: "ឈ្មោះអ្នកប្រើប្រាស់",
    passwordLabel: "ពាក្យសម្ងាត់",
    roleLabel: "តួនាទី",
    loginButton: "ចូលប្រើ",
    selectUser: "ជ្រើសរើសអ្នកប្រើប្រាស់",
  },
  navigation: {
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    stockIn: "ស្តុកចូល",
    stockOut: "ស្តុកចេញ",
    manageItems: "គ្រប់គ្រងសម្ភារៈ",
    manageCategories: "គ្រប់គ្រងប្រភេទ",
    manageUsers: "គ្រប់គ្រងអ្នកប្រើប្រាស់",
    reports: "របាយការណ៍",
    logout: "ចាកចេញ",
  },
  dashboard: {
    title: "ផ្ទាំងគ្រប់គ្រង",
    totalItems: "ចំនួនសម្ភារៈសរុប (ប្រភេទ)",
    totalStockQuantity: "បរិមាណស្តុកសរុប (គ្រឿង)",
    recentStockIn: "ស្តុកចូលថ្មីៗ",
    recentStockOut: "ស្តុកចេញថ្មីៗ",
    noRecentActivity: "មិនមានសកម្មភាពថ្មីៗ",
    viewAll: "មើល​ទាំងអស់",
    item: "សម្ភារៈ",
    quantity: "បរិមាណ",
    date: "កាលបរិច្ឆេទ",
    category: "ប្រភេទ",
    currentInventory: "ស្តុកបច្ចុប្បន្ន",
  },
  stockIn: {
    title: "បន្ថែមស្តុកចូល",
    itemLabel: "សម្ភារៈ",
    selectItem: "ជ្រើសរើសសម្ភារៈ",
    newItemLabel: "សម្ភារៈថ្មី",
    categoryLabel: "ប្រភេទ",
    selectCategory: "ជ្រើសរើសប្រភេទ",
    newCategoryLabel: "ប្រភេទថ្មី",
    quantityLabel: "បរិមាណ",
    dateLabel: "កាលបរិច្ឆេទ",
    supplierLabel: "អ្នកផ្គត់ផ្គង់ (ស្រេចចិត្ត)",
    notesLabel: "កំណត់ចំណាំ (ស្រេចចិត្ត)",
    addButton: "បន្ថែមស្តុកចូល",
    successMessage: "បានបន្ថែមស្តុកចូលដោយជោគជ័យ!",
  },
  stockOut: {
    title: "បញ្ចេញស្តុក",
    itemLabel: "សម្ភារៈ",
    selectItem: "ជ្រើសរើសសម្ភារៈ",
    quantityLabel: "បរិមាណ",
    availableQuantity: "បរិមាណមានក្នុងស្តុក",
    dateLabel: "កាលបរិច្ឆេទ",
    reasonLabel: "មូលហេតុ (ស្រេចចិត្ត)",
    notesLabel: "កំណត់ចំណាំ (ស្រេចចិត្ត)",
    addButton: "បញ្ចេញស្តុក",
    successMessage: "បានបញ្ចេញស្តុកដោយជោគជ័យ!",
    insufficientStock: "បរិមាណស្តុកមិនគ្រប់គ្រាន់។",
  },
  manageItems: {
    title: "គ្រប់គ្រងសម្ភារៈ",
    addItem: "បន្ថែមសម្ភារៈថ្មី",
    itemNameLabel: "ឈ្មោះសម្ភារៈ",
    itemDescriptionLabel: "ការពិពណ៌នា (ស្រេចចិត្ត)",
    categoryLabel: "ប្រភេទ",
    noItems: "មិនមានសម្ភារៈ។",
    actions: "សកម្មភាព",
    edit: "កែសម្រួល",
    delete: "លុប",
    confirmDelete: "តើអ្នកពិតជាចង់លុបសម្ភារៈនេះមែនទេ?",
    itemAdded: "បានបន្ថែមសម្ភារៈថ្មីដោយជោគជ័យ!",
    itemUpdated: "បានធ្វើបច្ចុប្បន្នភាពសម្ភារៈដោយជោគជ័យ!",
    itemDeleted: "បានលុបសម្ភារៈដោយជោគជ័យ!",
  },
  manageCategories: {
    title: "គ្រប់គ្រងប្រភេទសម្ភារៈ",
    addCategory: "បន្ថែមប្រភេទថ្មី",
    categoryNameLabel: "ឈ្មោះប្រភេទ",
    noCategories: "មិនមានប្រភេទសម្ភារៈ។",
    categoryAdded: "បានបន្ថែមប្រភេទថ្មីដោយជោគជ័យ!",
    categoryUpdated: "បានធ្វើបច្ចុប្បន្នភាពប្រភេទដោយជោគជ័យ!",
    categoryDeleted: "បានលុបប្រភេទដោយជោគជ័យ!",
     confirmDelete: "តើអ្នកពិតជាចង់លុបប្រភេទនេះមែនទេ? សម្ភារៈទាំងអស់ក្នុងប្រភេទនេះនឹងត្រូវបានដកចេញពីប្រភេទ។",
  },
  manageUsers: {
    title: "គ្រប់គ្រងអ្នកប្រើប្រាស់",
    addUser: "បន្ថែមអ្នកប្រើប្រាស់ថ្មី",
    usernameLabel: "ឈ្មោះអ្នកប្រើប្រាស់",
    passwordLabel: "ពាក្យសម្ងាត់",
    roleLabel: "តួនាទី",
    selectRole: "ជ្រើសរើសតួនាទី",
    noUsers: "មិនមានអ្នកប្រើប្រាស់។",
    userAdded: "បានបន្ថែមអ្នកប្រើប្រាស់ថ្មីដោយជោគជ័យ!",
    userUpdated: "បានធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់ដោយជោគជ័យ!",
    userDeleted: "បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ!",
    confirmDelete: "តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?",
  },
  reports: {
    title: "របាយការណ៍ និងការទាញទិន្នន័យ",
    exportInventory: "ទាញយកស្តុកបច្ចុប្បន្ន (Excel)",
    exportStockMovements: "ទាញយកចលនាស្តុក (Excel)",
    exportSuccess: "ទិន្នន័យបានទាញយកដោយជោគជ័យ!",
  },
  common: {
    save: "រក្សាទុក",
    cancel: "បោះបង់",
    add: "បន្ថែម",
    edit: "កែសម្រួល",
    delete: "លុប",
    confirm: "បញ្ជាក់",
    close: "បិទ",
    name: "ឈ្មោះ",
    description: "ការពិពណ៌នា",
    actions: "សកម្មភាព",
    filterByCategory: "ត្រងតាមប្រភេទ",
    allCategories: "គ្រប់ប្រភេទទាំងអស់",
    searchPlaceholder: "ស្វែងរក...",
    noDataAvailable: "មិនមានទិន្នន័យ",
    loading: "កំពុងដំណើរការ...",
  },
};

export const DEFAULT_USERS: User[] = [
  { id: 'admin001', username: 'admin', role: UserRole.Admin, password: 'password123' },
  { id: 'user001', username: 'user', role: UserRole.User, password: 'password123' },
];

export const INITIAL_CATEGORIES: Category[] = [
    { id: 'cat001', name: 'សម្ភារៈការិយាល័យ' },
    { id: 'cat002', name: 'គ្រឿងអេឡិចត្រូនិច' },
    { id: 'cat003', name: 'សម្ភារៈ​អនាម័យ' },
];

export const INITIAL_ITEMS: Item[] = [
    { id: 'item001', name: 'ក្រដាស A4', categoryId: 'cat001', description: 'ក្រដាសសម្រាប់បោះពុម្ព' },
    { id: 'item002', name: 'ប៊ិច', categoryId: 'cat001', description: 'ប៊ិចសម្រាប់សរសេរ' },
    { id: 'item003', name: 'កុំព្យូទ័រយួរដៃ', categoryId: 'cat002', description: 'Dell XPS 15' },
];


// SVG Icons
export const HomeIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const ArrowDownTrayIcon = (props: { className?: string }) => ( // Stock In
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const ArrowUpTrayIcon = (props: { className?: string }) => ( // Stock Out
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const UsersIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export const DocumentTextIcon = (props: { className?: string }) => ( // Reports
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const TagIcon = (props: { className?: string }) => ( // Categories
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export const CubeIcon = (props: { className?: string }) => ( // Items
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);


export const PlusCircleIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PencilIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

export const TrashIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${props.className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.222.261m3.222.261L12 5.5M11.38 4.939l.595-1.591a.656.656 0 01.743-.534h1.546c.296 0 .56.196.668.477l.595 1.591m0 0A48.11 48.11 0 0112 5.5m0 0l-2.723-.561m2.723.561c.229-.046.453-.096.674-.147m-6.42 0S5.942 3.46 5.035 3.351A.656.656 0 004.38 3.899l-.595 1.591m0 0A48.11 48.11 0 0012 5.5m-6.42 0c.229-.046.453-.096.674-.147m0 0L5.035 3.351" />
  </svg>
);

export const LogoutIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${props.className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
</svg>
);

export const NavItems = (role: UserRole | null) => {
  const allNavItems = [
    { page: Page.Dashboard, label: KHMER_TEXTS.navigation.dashboard, icon: HomeIcon, adminOnly: false },
    { page: Page.StockIn, label: KHMER_TEXTS.navigation.stockIn, icon: ArrowDownTrayIcon, adminOnly: false },
    { page: Page.StockOut, label: KHMER_TEXTS.navigation.stockOut, icon: ArrowUpTrayIcon, adminOnly: false },
    { page: Page.ManageItems, label: KHMER_TEXTS.navigation.manageItems, icon: CubeIcon, adminOnly: false },
    { page: Page.ManageCategories, label: KHMER_TEXTS.navigation.manageCategories, icon: TagIcon, adminOnly: false },
    { page: Page.Reports, label: KHMER_TEXTS.navigation.reports, icon: DocumentTextIcon, adminOnly: false },
    { page: Page.ManageUsers, label: KHMER_TEXTS.navigation.manageUsers, icon: UsersIcon, adminOnly: true },
  ];
  if (role === UserRole.Admin) {
    return allNavItems;
  }
  return allNavItems.filter(item => !item.adminOnly);
};

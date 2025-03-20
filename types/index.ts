export interface Category {
  id: string;
  name: string;
}

export interface Spent {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  remarks: string;
}

export interface SpendingByCategory {
  categoryId: string;
  categoryName: string;
  total: number;
}

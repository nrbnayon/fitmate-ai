// types/user.ts
export interface User {  
id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest" | "creator";
  image?: string;
  status?: "Active" | "Inactive" | "Pending";
  location?: string;
  date?: string;
  phone?: string;
  
  // Specific to Creators
  videos?: number;
  sales?: number;
  commission?: number;
  
  // Modal Details
  totalEarnings?: number;
  totalOrders?: number;
  totalReviews?: number;
  withdraws?: number;
  totalSpending?: number; // For regular users
  activeOrders?: Order[];
  previousOrders?: Order[];
}

export interface Order {
  id: string;
  productName: string;
  variant: string;
  image: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "user" | "guest" | "creator";
}

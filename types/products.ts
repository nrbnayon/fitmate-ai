export interface Product {
    id: string; // Internal UUID
    productId: string; // Display ID e.g. Lip-12-abc
    name: string;
    stock: number;
    price: number;
    category: string; // Displayed as "User type" in table
    description: string;
    image?: string;
    shade?: string; // Keeping shade as optional as it might be used in details or other views, though not in main table
}

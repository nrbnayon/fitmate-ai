// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  image?: string;
  status?: string;
  location?: string;
  date?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

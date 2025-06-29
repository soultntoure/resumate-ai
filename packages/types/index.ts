// Shared TypeScript interfaces, types, enums (DTOs, models)

export interface User {
  id: string;
  email: string;
  password?: string; // Should be omitted in frontend or when sending to client
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  imageUrl?: string;
  content: string; // HTML or JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  templateId: string;
  data: Record<string, any>; // JSON blob for resume content
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example DTOs (can be extended with Zod schemas on frontend, class-validator on backend)
export interface LoginResponse {
  accessToken: string;
}

export interface UserProfile extends Omit<User, 'password'> {}

// Add more as needed: e.g., Education, Experience, Skill interfaces for resume data
export interface ExperienceItem {
  title: string;
  company: string;
  location?: string;
  startDate: string; // YYYY-MM-DD or YYYY-MM
  endDate?: string; // YYYY-MM-DD or 'Present'
  description?: string[]; // Bullet points
}

export interface EducationItem {
  degree: string;
  major?: string;
  university: string;
  location?: string;
  startDate: string;
  endDate?: string;
}

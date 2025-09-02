// Type definitions for InstantDB entities
export interface TodoEntity {
  id: string;
  title: string;
  completed: boolean;
  order?: number;
  createdAt?: number;
  user?: {
    id: string;
  };
}

export interface InstantError {
  body?: {
    message?: string;
  };
}
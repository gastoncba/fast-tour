export interface PaginatedResponse<T> {
  page: number;
  items: T[];
  count: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IService<T> {
  find(query?: Record<string, any>, relations?: string[]): Promise<T[]>;
  findOne(id: string, relations?: string[]): Promise<T>;
  create(data: Record<string, any>): Promise<T>;
  update(id: string, changes: Record<string, any>): Promise<T>;
  remove(id: string): Promise<void> | Promise<any>;
  findPaginated(page?: number, limit?: number, query?: Record<string, any>, relations?: string[]): Promise<PaginatedResponse<T>>;
}

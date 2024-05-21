export interface IService<T> {
  find(query?: Record<string, any>): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(data: Record<string, any>): Promise<T>;
  update(id: string, changes: Record<string, any>): Promise<T>;
  remove(id: string): Promise<void> | Promise<any>;
}

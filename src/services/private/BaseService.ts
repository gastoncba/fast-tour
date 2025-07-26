import { Repository, FindManyOptions, ObjectLiteral } from "typeorm";
import { PaginatedResponse, IService } from "./IService";

export abstract class BaseService<T extends ObjectLiteral> implements IService<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  abstract find(query?: Record<string, any>, relations?: string[]): Promise<T[]>;
  abstract findOne(id: string, relations?: string[]): Promise<T>;
  abstract create(data: Record<string, any>): Promise<T>;
  abstract update(id: string, changes: Record<string, any>): Promise<T>;
  abstract remove(id: string): Promise<void> | Promise<any>;

  async findPaginated(
    page: number = 1,
    limit: number = 10,
    query?: Record<string, any>,
    relations?: string[]
  ): Promise<PaginatedResponse<T>> {
    const skip = (page - 1) * limit;
    
    // Construir opciones de búsqueda
    const options: FindManyOptions<T> = {
      skip,
      take: limit,
      relations,
      order: { id: "ASC" } as any,
    };

    // Aplicar filtros adicionales si existen
    if (query) {
      this.applyQueryFilters(options, query);
    }

    // Obtener items y total
    const [items, totalItems] = await this.repository.findAndCount(options);
    
    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      page,
      items,
      count: totalPages,
      totalItems,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  protected applyQueryFilters(options: FindManyOptions<T>, query: Record<string, any>): void {
    // Este método puede ser sobrescrito por las clases hijas para aplicar filtros específicos
    // Por defecto, no aplica filtros adicionales
  }
} 
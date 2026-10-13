import { ResourceQuery as CoreResourceQuery } from './core/resource-query.js';
import { PageMetaDTO } from './pagination/page-meta.dto.js';
import { PaginatedDTO } from './pagination/paginated.dto.js';

/** Resource helpers preserving decorated response DTOs for existing consumers. */
export class ResourceQuery extends CoreResourceQuery {
  /**
   * Creates the legacy decorated paginated response.
   *
   * @param {T[]} items Mapped and projected response items.
   * @param {PageMetaDTO} meta Pagination metadata from the service.
   * @returns {PaginatedDTO<T>} Decorated response envelope.
   */
  protected static override createResponse<T>(items: T[], meta: PageMetaDTO): PaginatedDTO<T> {
    return new PaginatedDTO(items, meta);
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errorCode?: string | null
}

export interface PaginationInfo {
  pageNumber: number
  pageSize: number
  totalRecords: number
  totalPages: number
}

export interface PagedResponse<T> {
  items: T[]
  pagination: PaginationInfo
}

export type UserRole = 'VILLAGER' | 'SECRETARY' | 'ADMIN'

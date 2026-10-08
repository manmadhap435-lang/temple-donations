import { Button } from './Button'

interface PaginationProps {
  pageNumber: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ pageNumber, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        disabled={pageNumber <= 1}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Previous
      </Button>
      <span className="pagination-info">
        Page {pageNumber} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={pageNumber >= totalPages}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
      </Button>
    </div>
  )
}

import type { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, id, className = '', children, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`form-field ${className}`}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <select id={selectId} className={error ? 'input-error' : ''} {...props}>
        {children}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

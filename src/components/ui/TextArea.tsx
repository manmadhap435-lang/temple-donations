import type { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, id, className = '', ...props }: TextAreaProps) {
  const areaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`form-field ${className}`}>
      {label && <label htmlFor={areaId}>{label}</label>}
      <textarea id={areaId} className={error ? 'input-error' : ''} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

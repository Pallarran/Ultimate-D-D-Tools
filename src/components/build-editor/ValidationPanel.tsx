import { useState } from 'react';
import type { ValidationResult, ValidationError, ValidationWarning } from '../../utils/buildValidation';

interface ValidationPanelProps {
  validation: ValidationResult;
  className?: string;
}

const ValidationPanel = ({ validation, className = '' }: ValidationPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <div className={`validation-panel valid ${className}`}>
        <div className="validation-summary">
          <div className="validation-icon">✅</div>
          <span className="validation-text">Build is valid</span>
        </div>
      </div>
    );
  }

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div className={`validation-panel ${hasErrors ? 'has-errors' : 'has-warnings'} ${className}`}>
      <div 
        className="validation-summary"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
      >
        <div className="validation-icon">
          {hasErrors ? '❌' : '⚠️'}
        </div>
        <span className="validation-text">
          {hasErrors ? `${validation.errors.length} error${validation.errors.length === 1 ? '' : 's'}` : ''}
          {hasErrors && hasWarnings ? ', ' : ''}
          {hasWarnings ? `${validation.warnings.length} warning${validation.warnings.length === 1 ? '' : 's'}` : ''}
        </span>
        <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </div>
      </div>

      {isExpanded && (
        <div className="validation-details">
          {validation.errors.map((error) => (
            <ValidationItem key={error.id} item={error} />
          ))}
          {validation.warnings.map((warning) => (
            <ValidationItem key={warning.id} item={warning} />
          ))}
        </div>
      )}

      <style>{`
        .validation-panel {
          border-radius: var(--rounded-lg);
          overflow: hidden;
          transition: var(--transition);
          border: 1px solid var(--border-color);
        }

        .validation-panel.valid {
          background: rgba(var(--success-rgb, 34, 197, 94), 0.1);
          border-color: rgba(var(--success-rgb, 34, 197, 94), 0.3);
        }

        .validation-panel.has-warnings {
          background: rgba(var(--warning-rgb, 245, 158, 11), 0.1);
          border-color: rgba(var(--warning-rgb, 245, 158, 11), 0.3);
        }

        .validation-panel.has-errors {
          background: rgba(var(--error-rgb, 239, 68, 68), 0.1);
          border-color: rgba(var(--error-rgb, 239, 68, 68), 0.3);
        }

        .validation-summary {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .validation-summary:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .validation-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .validation-text {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
        }

        .expand-icon {
          font-size: 0.75rem;
          color: var(--text-secondary);
          transition: var(--transition);
          transform-origin: center;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .validation-details {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.02);
        }

        .validation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .validation-item:last-child {
          border-bottom: none;
        }

        .validation-item.error {
          background: rgba(var(--error-rgb, 239, 68, 68), 0.05);
        }

        .validation-item.warning {
          background: rgba(var(--warning-rgb, 245, 158, 11), 0.05);
        }

        .validation-item-icon {
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .validation-item-content {
          flex: 1;
          min-width: 0;
        }

        .validation-item-field {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .validation-item-message {
          font-size: var(--text-sm);
          color: var(--text-primary);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .validation-summary {
            padding: 0.625rem 0.75rem;
            gap: 0.5rem;
          }

          .validation-item {
            padding: 0.625rem 0.75rem;
            gap: 0.5rem;
          }

          .validation-text {
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </div>
  );
};

interface ValidationItemProps {
  item: ValidationError | ValidationWarning;
}

const ValidationItem = ({ item }: ValidationItemProps) => {
  return (
    <div className={`validation-item ${item.severity}`}>
      <div className="validation-item-icon">
        {item.severity === 'error' ? '🚫' : '⚠️'}
      </div>
      <div className="validation-item-content">
        <div className="validation-item-field">{item.field}</div>
        <div className="validation-item-message">{item.message}</div>
      </div>
    </div>
  );
};

export default ValidationPanel;
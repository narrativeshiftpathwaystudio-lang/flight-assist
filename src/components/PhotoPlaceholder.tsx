interface PhotoPlaceholderProps {
  label: string;
  className?: string;
  src?: string;
}

/**
 * Stands in for real editorial photography until a `src` is supplied.
 * Pass `src` (an imported asset or a /public path) to swap in the real
 * photo — layout, positioning, and overlays around it stay unchanged.
 */
export function PhotoPlaceholder({ label, className = "", src }: PhotoPlaceholderProps) {
  if (src) {
    return <img src={src} alt={label} className={`object-cover ${className}`} />;
  }
  return <div className={`photo-placeholder ${className}`} data-label={label} role="img" aria-label={label} />;
}

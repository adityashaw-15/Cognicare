import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ThreeDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'soft' | 'danger';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function ThreeDButton({ children, variant = 'primary', icon, fullWidth = false, className = '', ...props }: ThreeDButtonProps) {
  return (
    <button className={`btn-3d btn-3d-${variant} ${fullWidth ? 'btn-full-width' : ''} ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

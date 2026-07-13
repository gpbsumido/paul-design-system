import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cx } from './cx';

type CardVariant = 'elevated' | 'interactive';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
};

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  function Card({ variant, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx('card', variant && `card--${variant}`, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

function Header({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card__header', className)} {...props}>{children}</div>;
}

function Body({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card__body', className)} {...props}>{children}</div>;
}

function Footer({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card__footer', className)} {...props}>{children}</div>;
}

export const Card = Object.assign(CardRoot, { Header, Body, Footer });

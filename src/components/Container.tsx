// /components/Container.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type TWMax = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

export type ContainerProps = Omit<ComponentPropsWithoutRef<'div'>, 'style'> & {
  /** Optional max width:
   *  - Tailwind token: "sm" | ... | "7xl" | "none"
   *  - number: treated as px (e.g., 1200)
   *  - CSS length: "80ch" | "72rem" | "1200px" | "90%" | etc.
   */
  maxWidth?: TWMax | number | `${number}${'px' | 'rem' | 'ch' | '%' | 'vw'}`;
  style?: ComponentPropsWithoutRef<'div'>['style'];
};

const tokenToClass: Record<TWMax, string> = {
  none: 'max-w-none',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { children, className, maxWidth = '7xl', style, ...props },
  ref,
) {
  const maxWidthClass =
    typeof maxWidth === 'string' && maxWidth in tokenToClass
      ? tokenToClass[maxWidth as TWMax]
      : undefined;

  // If not using a known Tailwind token, fall back to inline maxWidth.
  const inlineStyle = maxWidthClass
    ? style
    : {
        ...style,
        ...(maxWidth != null
          ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
          : {}),
      };

  return (
    <div
      ref={ref}
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        maxWidthClass ?? 'max-w-7xl', // default when no custom token provided
        className, // letting className come last so it can override if needed
      ]
        .filter(Boolean)
        .join(' ')}
      style={inlineStyle}
      {...props}
    >
      {children}
    </div>
  );
});

export default Container;

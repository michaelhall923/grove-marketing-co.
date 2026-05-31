type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  /** Next.js-compatible: image fills positioned parent (parent must be `relative`) */
  fill?: boolean;
  sizes?: string;
};

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority,
  fill,
}: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={['absolute inset-0 h-full w-full', className].filter(Boolean).join(' ')}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

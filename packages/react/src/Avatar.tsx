import { cx } from './cx';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
};

export function Avatar({ src, alt, size, fallback }: AvatarProps) {
  return (
    <div className={cx('avatar', size && `avatar--${size}`)}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span className="avatar--fallback">{fallback}</span>
      )}
    </div>
  );
}

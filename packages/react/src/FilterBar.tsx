import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';

type FilterBarProps = Omit<HTMLAttributes<HTMLElement>, 'aria-label'> & {
  /**
   * Accessible name for the region (e.g. "Team and player filters"). Required
   * because the bar is a labelled landmark; without a name the region would be
   * ignored by assistive tech.
   */
  label: string;
  children: ReactNode;
};

/**
 * A labelled region that holds a wrapping row of filter controls (typically
 * `Select`s). Renders a `<section>` landmark so its controls sit inside a named
 * region, with a centered, max-width row that wraps when space is tight.
 */
export const FilterBar = forwardRef<HTMLElement, FilterBarProps>(
  function FilterBar({ label, children, className, ...props }, ref) {
    return (
      <section ref={ref} aria-label={label} className={cx('filter-bar', className)} {...props}>
        <div className="filter-bar__row">{children}</div>
      </section>
    );
  },
);

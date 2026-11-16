import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, children, className }: Props) {
  return (
    <header className={`shell pb-12 pt-14 lg:pb-16 lg:pt-24 ${className ?? ""}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="t-eyebrow">{eyebrow}</p>
          <h1 className="t-title mt-5 max-w-[16ch]">{title}</h1>
        </div>
        {description ? (
          <div className="lg:col-span-4 lg:pb-2">
            <p className="t-body max-w-[38ch]">{description}</p>
          </div>
        ) : null}
      </div>
      {children ? <div className="mt-10 lg:mt-12">{children}</div> : null}
    </header>
  );
}

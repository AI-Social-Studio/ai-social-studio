import type { ReactNode } from "react";

type Props = {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export function SidebarNavItem({ href, icon, label, active }: Props) {
  const base =
    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg";
  const state = active
    ? "text-blue-700 bg-blue-50/80"
    : "text-gray-600 hover:bg-gray-50";

  return (
    <a href={href} className={`${base} ${state}`}>
      {icon}
      {label}
    </a>
  );
}

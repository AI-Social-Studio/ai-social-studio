import { CaretRight, House } from "@phosphor-icons/react/dist/ssr";

export function TopHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 flex-shrink-0">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <a
          href="#"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <House size={16} weight="fill" />
          <span>Overview</span>
        </a>
        <CaretRight size={12} className="text-gray-300" />
        <a
          href="#"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          Campaigns
        </a>
        <CaretRight size={12} className="text-gray-300" />
        <span className="text-gray-900 font-medium">New AI Campaign</span>
      </nav>
    </header>
  );
}

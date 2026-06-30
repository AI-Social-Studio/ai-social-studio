import {
  CaretUpDown,
  ClockCounterClockwise,
  House,
  Megaphone,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { SidebarNavItem } from "./sidebar-nav-item";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/">
          <Image src="/socialstudio.png" alt="socialstudio.ai" width={99} height={32} priority />
        </Link>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-medium text-gray-400 mb-3 px-3 uppercase tracking-wider">
          Main menu
        </div>
        <nav className="space-y-1 mb-8">
          <SidebarNavItem
            href="#"
            icon={<House size={18} weight="fill" />}
            label="Overview"
            active
          />
          <SidebarNavItem
            href="#"
            icon={<Megaphone size={18} />}
            label="Brand Voice"
          />
          <SidebarNavItem
            href="#"
            icon={<ClockCounterClockwise size={18} />}
            label="History"
          />
        </nav>

        <div className="text-xs font-medium text-gray-400 mb-3 px-3 uppercase tracking-wider">
          AI Engines
        </div>
        <nav className="space-y-1">
          <SidebarNavItem
            href="#"
            icon={<span className="w-2 h-2 rounded-full bg-blue-500" />}
            label="LinkedIn B2B"
          />
          <SidebarNavItem
            href="#"
            icon={<span className="w-2 h-2 rounded-full bg-pink-500" />}
            label="Instagram Vibe"
          />
          <SidebarNavItem
            href="#"
            icon={<span className="w-2 h-2 rounded-full bg-gray-300" />}
            label="X (Twitter) Short"
          />
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
              AS
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Andrew Smith
              </div>
              <div className="text-xs text-gray-500">andrew@gmail.com</div>
            </div>
          </div>
          <CaretUpDown size={14} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
}

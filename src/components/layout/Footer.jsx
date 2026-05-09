import { ShieldCheck, LifeBuoy } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 px-6 border-t bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Copyright */}
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-azure-pop rounded-md flex items-center justify-center">
              <LifeBuoy size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-800 tracking-tight">
              Support<span className="text-azure-pop">Sync</span>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest hidden md:block">
            © {currentYear} All Rights Reserved
          </span>
        </div>

        {/* Center: System Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">
            System Operational
          </span>
        </div>

        {/* Right: Security & Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-medium uppercase">Secure Data</span>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-azure-pop uppercase transition-colors">
              Terms
            </a>
            <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-azure-pop uppercase transition-colors">
              Privacy
            </a>
          </nav>
        </div>

      </div>
    </footer>
  );
}

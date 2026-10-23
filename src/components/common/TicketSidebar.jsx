import { X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function TicketSidebar({
  open,
  onClose,
  title,
  children,
  contentClassName = "",
  width = "40rem",
}) {
  return (
    <SidebarProvider
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      mobileOpen={open}
      onMobileOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      className="contents"
      style={{ "--sidebar-width": width }}
    >
      <button
        type="button"
        aria-label={`Close ${title.toLowerCase()} sidebar`}
        onClick={onClose}
        className={[
          "fixed inset-0 z-20 bg-black/30 transition-opacity duration-300",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <Sidebar
        side="right"
        collapsible="offcanvas"
        variant="sidebar"
        mobileWidth="100vw"
        className="z-30"
      >
        <SidebarHeader className="flex-row items-center justify-between bg-azure-pop text-white">
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()} sidebar`}
            className="rounded-sm p-1 text-white transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </SidebarHeader>

        <SidebarContent className={contentClassName}>
          {children}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

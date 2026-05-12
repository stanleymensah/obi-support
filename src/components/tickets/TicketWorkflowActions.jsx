import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const normalizeStatus = (status) =>
  String(status ?? "closed").trim().toLowerCase().replace(/\s+/g, "-");

const getUserDisplayName = (user) => {
  if (typeof user === "string") {
    return user.trim();
  }

  return (
    user?.fullName ??
    user?.name ??
    user?.username ??
    user?.email ??
    ""
  )
    .toString()
    .trim();
};

export default function TicketWorkflowActions({
  ticket,
  users = [],
  effectiveAssignee = "",
  canManageTickets = true,
  onAssigneeChange,
  onAssign,
  onStartWork,
  onMarkResolved,
  onCloseTicket,
  onReopenTicket,
}) {
  const availableUsers = useMemo(() => {
    return users.map(getUserDisplayName).filter(Boolean);
  }, [users]);

  const status = normalizeStatus(ticket?.status);
  const hasSelectedAssignee = Boolean(String(effectiveAssignee || "").trim());

  if (!canManageTickets) {
    return (
      <div className="flex w-full flex-col items-center py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Ticket Actions
        </span>
        <p className="mt-2 text-xs text-muted-foreground">
          Only the assigned user or admins can change ticket workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center py-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Ticket Actions
      </span>

      <div className="mt-2 w-full">
        {status === "open" && (
          <div className="flex w-full items-end gap-2">
            <div className="flex-1">
              <select
                value={effectiveAssignee}
                onChange={(event) => onAssigneeChange?.(event.target.value)}
                className={cn(
                  "h-8 w-full rounded-md border border-border bg-muted/40 px-3 text-[11px] text-foreground outline-none transition-colors focus:border-ring focus:bg-background"
                )}
              >
                <option value="">Select user</option>
                {availableUsers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="h-auto px-3 py-1.5 text-xs whitespace-nowrap"
              disabled={!hasSelectedAssignee}
              onClick={onAssign}
            >
              Assign User
            </Button>
          </div>
        )}

        {(status === "assigned" || status === "reopened") && (
          <div className="flex w-full items-end">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="h-auto px-3 py-1.5 text-xs whitespace-nowrap"
              onClick={onStartWork}
            >
              Start Work
            </Button>
          </div>
        )}

        {status === "in-progress" && (
          <div className="flex w-full items-end">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="h-auto px-3 py-1.5 text-xs whitespace-nowrap"
              onClick={onMarkResolved}
            >
              Mark as Resolved
            </Button>
          </div>
        )}

        {status === "resolved" && (
          <div className="flex w-full items-end gap-2 flex-nowrap">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="h-auto px-3 py-1.5 text-xs whitespace-nowrap"
              onClick={onCloseTicket}
            >
              Close Ticket
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              className="h-auto px-3 py-1.5 text-xs whitespace-nowrap"
              onClick={onReopenTicket}
            >
              Reopen Ticket
            </Button>
          </div>
        )}

        {status === "closed" && (
          <p className="text-xs text-muted-foreground">Ticket Closed</p>
        )}

        {![
          "open",
          "assigned",
          "reopened",
          "in-progress",
          "resolved",
          "closed",
        ].includes(status) && (
          <p className="text-xs text-muted-foreground">Ticket Closed</p>
        )}
      </div>
    </div>
  );
}
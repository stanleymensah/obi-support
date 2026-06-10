import { TicketSlash } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NoTickets() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TicketSlash />
        </EmptyMedia>
        <EmptyTitle>No Tickets Yet</EmptyTitle>
        <EmptyDescription>
          There are no tickets here. Get started by creating
          your first one.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

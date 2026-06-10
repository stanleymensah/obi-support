import { UserRoundX } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NoUsers() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserRoundX />
        </EmptyMedia>
        <EmptyTitle>No Users Yet</EmptyTitle>
        <EmptyDescription>
          There are no users here. Get started by creating
          your first one.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

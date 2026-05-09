
export default function TicketDetails({ticket}) {
  return (
    <>
    <div className="flex flex-col w-full">
        <div className="description w-full">
            {ticket.description}
        </div>
        <div className="other grid grid-cols-3">
            <div className="col-span-1 flex flex-col gap-1">
                <h4>Status</h4>
                <span>{ticket.status}</span>
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <h4>Priority</h4>
                <span>{ticket.priority}</span>
            </div>

        </div>
    </div>
    </>
  )
}

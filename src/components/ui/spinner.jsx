import { LoaderCircle } from "lucide-react"

export default function Spinner() {
  return (
    <>
    <div className="animate-spin text-white ms-1">
        <LoaderCircle size={14} strokeWidth={2} />
    </div>
    </>
  )
}

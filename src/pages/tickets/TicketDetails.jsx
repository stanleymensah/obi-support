import { formatDate } from "@/lib/utils";
import {
  ASSIGNEE_DISPLAY_FIELD,
  getTicketAssigneeLabel,
  getTicketAssigneeUser,
} from "@/lib/assignee";
import { useState } from "react";
import TicketComments from "./Comments";
import { useTicketComments } from "@/hooks/useComments";

const normalizeStatus = (status) =>
  String(status ?? "closed")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const formatStatusLabel = (status) => {
  const normalized = String(status ?? "closed")
    .trim()
    .replace(/[-_]+/g, " ");
  const key = String(status ?? "closed")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (
    key.includes("inprog") ||
    key.includes("inprogress") ||
    key.includes("profress")
  ) {
    return "In-prog";
  }

  const map = {
    assigned: "Assigned",
    open: "Open",
    reopened: "Reopened",
    resolved: "Resolved",
    closed: "Closed",
  };

  if (map[key]) return map[key];

  return normalized
    ? normalized
        .split(/\s+/)
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "Closed";
};

export default function TicketDetails({ ticket, users, profile }) {
  const status = normalizeStatus(ticket?.status);
  const [activeTab, setActiveTab] = useState("comments");
  const { data: comments = [] } = useTicketComments(ticket?.id);
  const assigneeUser = getTicketAssigneeUser(ticket, users);
  const assigneeName = assigneeUser
    ? `${assigneeUser.firstName || assigneeUser.first_name || ""} ${assigneeUser.lastName || assigneeUser.last_name || ""}`.trim() ||
      assigneeUser.email ||
      "Unassigned"
    : getTicketAssigneeLabel(ticket, users, ASSIGNEE_DISPLAY_FIELD) ||
      "Unassigned";
  const creator = users?.find(
    (user) =>
      user.id === ticket?.createdById || user.uid === ticket?.createdById,
  );
  const creatorName = creator
    ? `${creator.firstName || creator.first_name || ""} ${creator.lastName || creator.last_name || ""}`.trim() ||
      creator.email ||
      "User"
    : "User";
  const creatorPhoto = creator?.photoURL || creator?.photo_url || null;
  const assigneePhoto =
    assigneeUser?.photoURL || assigneeUser?.photo_url || null;
  const dueDate = ticket?.created_at || ticket?.createdAt || ticket?.created;
  const labelValue = Array.isArray(ticket?.labels)
    ? ticket.labels[0]
    : ticket?.labels || ticket?.label || ticket?.priority || "";
  const commentsCount = comments.length;

  return (
    <div className="flex flex-col gap-5 px-1 py-1">
      <h3 className="max-w-xl text-2xl font-semibold leading-tight text-gray-900">
        {ticket?.title || "No title provided."}
      </h3>

      <div className="grid grid-cols-[92px_minmax(0,1fr)] min-w-120 gap-y-4 gap-x-4">
        <div className="text-gray-500">Status</div>
        <div
          className={`font-medium ${status === "completed" ? "text-emerald-600" : "text-gray-700"}`}
        >
          {formatStatusLabel(ticket?.status)}
        </div>

        <div className=" text-gray-500">Assigned to</div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-200">
            {assigneePhoto ? (
              <img
                src={assigneePhoto}
                alt={assigneeName}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <span className=" text-gray-700">{assigneeName}</span>
        </div>

        <div className=" text-gray-500">Created</div>
        <div className=" text-gray-700">
          {dueDate ? formatDate(dueDate) : "Pending..."}
        </div>

        <div className=" text-gray-500">Priority</div>
        <div>
          <span className="inline-flex w-fit items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-[12px] font-semibold text-violet-700">
            {labelValue || "Discover"}
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`relative pb-3  font-medium ${activeTab === "comments" ? "text-gray-900" : "text-gray-500"}`}
          >
            <span className="inline-flex items-center gap-2">
              Comments
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[12px] font-semibold text-gray-600">
                {commentsCount}
              </span>
            </span>
            {activeTab === "comments" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gray-900" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`relative pb-3  font-medium ${activeTab === "description" ? "text-gray-900" : "text-gray-500"}`}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gray-900" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-1">
        {activeTab === "comments" ? (
          <div className="">
            <TicketComments
              ticketId={ticket?.id}
              profile={profile}
              ticket={ticket}
              users={users}
            />
          </div>
        ) : (
          <div className="rounded-sm bg-gray-50 px-4 py-4  leading-relaxed text-gray-800">
            {ticket?.description || "No description provided."}
          </div>
        )}
      </div>
    </div>
  );
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp) => {
  if (!timestamp) return "Pending...";

  const date =
    typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
};
// Result: "5 minutes ago" or "2 days ago"

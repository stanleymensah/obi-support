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

export const sortByCreatedAt = (items, sortOrder = "asc") => {
  const toMillis = (value) => {
    if (!value) return 0;
    if (typeof value.toMillis === "function") return value.toMillis();
    if (typeof value.seconds === "number") return value.seconds * 1000;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return [...items].sort((left, right) => {
    const leftTime = toMillis(left.createdAt);
    const rightTime = toMillis(right.createdAt);
    return sortOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
  });
};

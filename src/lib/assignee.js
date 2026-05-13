export const ASSIGNEE_DISPLAY_FIELD = "fullName";

const ASSIGNEE_LABEL_FIELDS = {
  fullName: true,
  email: true,
  name: true,
  username: true,
};

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

export const getUserDisplayLabel = (user, displayField = ASSIGNEE_DISPLAY_FIELD) => {
  if (typeof user === "string") {
    return user.trim();
  }

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const fieldMap = {
    fullName: user?.fullName || fullName,
    email: user?.email,
    name: user?.name || user?.fullName || fullName,
    username: user?.username,
  };

  const preferredField = ASSIGNEE_LABEL_FIELDS[displayField] ? displayField : "fullName";

  return String(
    fieldMap[preferredField] || fieldMap.fullName || fieldMap.email || fieldMap.username || "",
  )
    .trim();
};

export const findUserByAssigneeValue = (users = [], assigneeValue = "") => {
  const normalizedAssignee = normalizeText(assigneeValue);
  if (!normalizedAssignee) return null;

  return (
    users.find((user) => {
      const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
      const candidates = [
        user?.id,
        user?.email,
        user?.fullName,
        user?.name,
        user?.username,
        fullName,
      ]
        .map(normalizeText)
        .filter(Boolean);

      return candidates.includes(normalizedAssignee);
    }) || null
  );
};

export const getTicketAssigneeUser = (ticket, users = []) => {
  if (!ticket) return null;

  const byId = users.find((user) => normalizeText(user?.id) === normalizeText(ticket.assigneeId));
  if (byId) return byId;

  return findUserByAssigneeValue(users, ticket.assignee);
};

export const getTicketAssigneeLabel = (
  ticket,
  users = [],
  displayField = ASSIGNEE_DISPLAY_FIELD,
) => {
  const user = getTicketAssigneeUser(ticket, users);
  if (user) {
    return getUserDisplayLabel(user, displayField);
  }

  return String(ticket?.assignee || ticket?.assigneeId || "").trim();
};

export const isTicketAssignedToProfile = (ticket, profile, userId) => {
  if (!ticket) return false;

  const assigneeId = normalizeText(ticket.assigneeId);
  const profileId = normalizeText(userId || profile?.uid);
  if (assigneeId && profileId && assigneeId === profileId) {
    return true;
  }

  const profileIdentifiers = [
    userId,
    profile?.uid,
    profile?.email,
    profile?.username,
    profile?.fullName,
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim(),
  ]
    .map(normalizeText)
    .filter(Boolean);

  const legacyAssignee = normalizeText(ticket.assignee);
  return profileIdentifiers.includes(legacyAssignee);
};

export const buildAssigneePayload = (user, displayField = ASSIGNEE_DISPLAY_FIELD) => {
  if (!user) {
    return { assigneeId: "", assignee: "" };
  }

  return {
    assigneeId: user.id || "",
    assignee: getUserDisplayLabel(user, displayField),
  };
};

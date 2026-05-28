import { useState } from "react";
import { useAddComment, useTicketComments } from "@/hooks/useComments";
import { useUsers } from "@/hooks/useUsers";
import { Send } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const formatDisplayName = (user) => {
  if (!user) return "User";

  const firstName = user.firstName || user.first_name || "";
  const lastName = user.lastName || user.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || user.fullName || user.name || user.email || "User";
};

const getInitials = (name) =>
  String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export default function TicketComments({ ticketId, profile, users: usersProp }) {
  const [text, setText] = useState("");
  const { data: comments } = useTicketComments(ticketId);
  const { data: usersFromHook = [] } = useUsers();
  const addMutation = useAddComment();
  const users = usersProp || usersFromHook;

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMutation.mutate({
      ticketId,
      text,
      userId: profile?.id || profile?.uid,
    });
    setText("");
  };

  const getCommentAuthor = (comment) => {
    const author = users.find((user) => user.id === comment.user_id || user.uid === comment.user_id);

    if (author) {
      return {
        name: formatDisplayName(author),
        photoURL: author.photoURL || author.photo_url || null,
      };
    }

    const fallbackName = comment.first_name || comment.userName || comment.user_id || "User";

    return {
      name: fallbackName,
      photoURL: null,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSend}>
        <div className="rounded-sm bg-white/70 p-4 ring-1 ring-gray-100">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment"
            rows={5}
            className="min-h-20 w-full resize-none border-0 bg-transparent p-0 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <div className="flex items-center gap-2 pt-1">

            <button
              type="submit"
              disabled={addMutation.isPending || !text.trim()}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={14} />
              Submit
            </button>
          </div>
        </div>
      </form>

      <div className="">

        {comments?.map((comment) => {
          const author = getCommentAuthor(comment);

          return (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {author.photoURL ? (
                    <img src={author.photoURL} alt={author.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-gray-500">
                      {getInitials(author.name)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-800">{author.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                  </div>

                  <div className="mt-2 text-sm leading-relaxed text-gray-600">
                    {comment.text}
                  </div>

                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

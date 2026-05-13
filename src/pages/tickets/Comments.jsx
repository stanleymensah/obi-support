import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { useAddComment, useTicketComments } from "@/hooks/useComments";
import { Send } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function TicketComments({ ticketId, profile }) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { data: comments } = useTicketComments(ticketId);
  const addMutation = useAddComment();

  // 🔥 Real-time listener
  useEffect(() => {
    if (!ticketId) return;
    const colRef = collection(db, "tickets", ticketId, "comments");
    const q = query(colRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Directly update the React Query cache!
      queryClient.setQueryData(["comments", ticketId], data);
    });

    return () => unsub(); // Cleanup on unmount
  }, [ticketId, queryClient]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMutation.mutate({ ticketId, text, userName: `${profile.firstName} ${profile.lastName}` });
    setText("");
  };

  return (
    <div className="flex flex-col max-h-60">
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-brand">{comment.userName}</span>
              <span className="text-[9px] text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <div className="bg-muted px-3 py-1 rounded-md rounded-tl-none text-xs text-foreground w-fit max-w-[85%]">
              {comment.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t pt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-card border border-border rounded-full px-4 py-1.5 text-xs outline-none"
        />
        <button className="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

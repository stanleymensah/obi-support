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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    <div className="flex flex-col h-112.5">
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-azure-pop">{comment.userName}{comment.userName.role}</span>
              <span className="text-[9px] text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-xs text-gray-700 w-fit max-w-[85%]">
              {comment.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t pt-4">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-gray-50 border rounded-full px-4 py-2 text-xs outline-none"
        />
        <button className="bg-azure-pop text-white w-10 h-10 rounded-full flex items-center justify-center">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

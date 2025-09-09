import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import type { Comment } from "./CommentSection";
import {
  Reply,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Props {
  comment: Comment & { children?: Comment[] };
  postId: number;
  reloadComments: () => Promise<void>;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId, reloadComments }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const { user } = useAuth();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setIsPending(true);
      setIsError(false);
      await createReply(
        replyText,
        postId,
        comment.id,
        user?.id,
        user?.email || "Anonymous"
      );
      setReplyText("");
      setShowReply(false);

      // reload comment tree so reply shows immediately
      await reloadComments();
    } catch (err) {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="pl-4 border-l border-white/10">
      {/* Comment Header */}
      <div className="flex items-center gap-2 text-sm mb-1">
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
          {comment.author}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>

      {/* Comment Content */}
      <p className="text-gray-500 text-sm leading-relaxed text-left">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="flex items-center gap-1 hover:text-indigo-400 transition"
        >
          <Reply className="w-3.5 h-3.5" />
          {showReply ? "Cancel" : "Reply"}
        </button>
        {comment.children?.length ? (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center gap-1 hover:text-gray-200 transition"
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                Show {comment.children.length} replies
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Hide replies
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Reply Form */}
      {showReply && user && (
        <form
          onSubmit={handleReplySubmit}
          className="mt-2 bg-white border border-gray-300 p-3 rounded-xl"
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-gray-300 bg-white text-black text-sm p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write a reply..."
            rows={2}
          />
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white text-sm px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && (
            <p className="flex items-center gap-1 text-red-400 mt-1 text-xs">
              <AlertCircle className="w-3.5 h-3.5" /> Error posting reply.
            </p>
          )}
        </form>
      )}

      {/* Nested Replies */}
      {!isCollapsed && comment.children && comment.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              reloadComments={reloadComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

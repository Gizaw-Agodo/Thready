import { useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
import { supabase } from "../supabase-client";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

interface CommentSectionProps {
  post_id: string | undefined;
}

const CommentSection = ({ post_id }: CommentSectionProps) => {
  const [commentTree, setCommentTree] = useState<
    (Comment & { children?: Comment[] })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [newCommentText, setNewCommentText] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const { user } = useAuth();

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      setIsPending(true);
      setIsError(null);

      const { error } = await supabase.from("comments").insert({
        post_id: post_id,
        content: newCommentText,
        parent_comment_id: null,
        user_id: user?.id,
        author: user?.user_metadata?.user_name,
      });

      if (error) throw new Error(error.message);

      setNewCommentText("");
      // reload comments after insert
      await loadComments();
    } catch (err: any) {
      setIsError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post_id)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      setCommentTree(buildCommentTree(data));
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post_id) loadComments();
  }, [post_id]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader text="Loading Comments..." />
      </div>
    );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4">
        Comments
      </h2>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white border border-gray-300 p-4 rounded-2xl shadow-md"
        >
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-gray-300 bg-white text-black text-sm p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write a comment..."
            rows={3}
          />
          <button
            type="submit"
            disabled={isPending}
            className="mt-3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && <p className="text-red-400 mt-2 text-sm">{isError}</p>}
        </form>
      ) : (
        <p className="mb-6 text-gray-400 italic">
          You must be logged in to post a comment.
        </p>
      )}

      {commentTree.length === 0 ? (
        <p className="text-gray-500 italic">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        commentTree.map((comment) => (
          <CommentItem
            key={comment.id}
            postId={Number(post_id)}
            comment={comment}
            reloadComments={loadComments}
          />
        ))
      )}
    </div>
  );
};

export default CommentSection;

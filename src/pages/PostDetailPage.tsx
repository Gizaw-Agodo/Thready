import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabase-client";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import CommentSection from "../components/CommentSection";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  likes?: number;
  comments?: number;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<number>(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  

  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else setPost(data);

      const { data: votesData, error: votesError } = await supabase
        .from("votes")
        .select("user_id, vote")
        .eq("post_id", id);

      if (votesError) {
        console.log("gamam", votesError);
      } else {
        setLikes(votesData.filter((v) => v.vote === 1).length);
        setDislikes(votesData.filter((v) => v.vote === -1).length);

        const myVote = votesData.find((v) => v.user_id === user?.id);
        if (myVote) setUserVote(myVote.vote);
      }

      setLoading(false);
    };

    if (id) fetchPost();
  }, [id, user]);

  // Handle vote
  const handleVote = async (voteValue: number) => {
    const isSameVote = userVote === voteValue;
    const nextVote = isSameVote ? 0 : voteValue;

    setLikes((prev) => prev + (nextVote === 1 ? 1 : userVote === 1 ? -1 : 0));
    setDislikes(
      (prev) => prev + (nextVote === -1 ? 1 : userVote === -1 ? -1 : 0)
    );
    setUserVote(nextVote);

    const { data: existing, error: fetchError } = await supabase
      .from("votes")
      .select("id")
      .eq("user_id", user?.id)
      .eq("post_id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error(fetchError);
      return;
    }

    if (existing) {
      // update existing
      const { error } = await supabase
        .from("votes")
        .update({ vote: nextVote })
        .eq("id", existing.id);

      if (error) console.error(error);
    } else {
      // insert new
      const { error } = await supabase.from("votes").insert({
        user_id: user?.id,
        post_id: id,
        vote: nextVote,
      });

      if (error) console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading Post..." />
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Post not found.
      </div>
    );

  return (
    <div className="min-h-screen  pt-16 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {post.title}
        </h1>

        {/* Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        )}

        {/* Content */}
        <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>

        {/* Posted on */}
        <p className="text-sm text-gray-400">
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-8 mt-4">
          {/* Like */}
          <button
            onClick={() => handleVote(1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
              userVote === 1
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                : "border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-500"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{likes}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => handleVote(-1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
              userVote === -1
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-500"
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span>{dislikes}</span>
          </button>
        </div>

        {/* Comment placeholder */}
        <CommentSection post_id={id} />
      </div>
    </div>
  );
};

export default PostDetail;

import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });
      if (error) console.error(error);
      else setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading Posts..." />
      </div>
    );

  return (
    <div className="min-h-screen  pt-16 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
        Recent Posts
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id = {post.id}
            title={post.title}
            image_url={post.image_url}
            likes={post.likes || 0}
            comments={post.comments || 0}

          />
        ))}
      </div>
    </div>
  );
};

export default Home;

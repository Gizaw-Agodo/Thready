import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabase-client";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";

interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  community_id: number;
  likes_count:number;
  comments_count:number;
}

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        // Fetch community info
        const { data: communityData, error: communityError } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityError) throw communityError;
        setCommunity(communityData);

        // Fetch posts under this community
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("community_id", id)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (err: any) {
        console.error("Error fetching community detail:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCommunityData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading Community...." />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Community not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Community Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{community.name}</h1>
          <p className="text-gray-600 mt-2">{community.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            Created at {new Date(community.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Posts in {community.name}
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  image_url={post.image_url}
                  likes={post.likes_count || 0}
                  comments={post.comments_count || 0}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No posts yet in this community.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;

import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import {  Users } from "lucide-react";
import Loader from "../components/Loader";
import { Link } from "react-router";

interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const CommunitiesList = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setCommunities(data || []);
      setLoading(false);
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading Communities...." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
        Explore Communities
      </h1>

      {communities.length === 0 ? (
        <p className="text-gray-500 italic">
          No communities yet. Be the first to create one!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {communities.map((community) => (
            <Link
              to={`/communities/${community.id}`}
              key={community.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition group cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <h2 className="font-semibold text-lg text-black group-hover:text-indigo-400 transition">
                  {community.name}
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {community.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Members (soon)
                </span>
                <span>
                  {new Date(community.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitiesList;

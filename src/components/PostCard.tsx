import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router";

interface PostCardProps {
  id:number,
  title: string;
  image_url?: string | null;
  likes?: number;
  comments?: number;
}

const PostCard = ({
  title,
  image_url,
  likes = 0,
  comments = 0,
  id,
}: PostCardProps) => {
  return (
    <Link
      to={`/posts/${id}`}
      className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
    >
      {/* Top row: bullet + title */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
        <h2 className="text-md font-semibold text-gray-800 truncate">
          {title}
        </h2>
      </div>

      {/* Image */}
      {image_url ? (
        <img
          src={image_url}
          alt={title}
          className="w-full h-60 object-cover rounded-2xl"
        />
      ) : (
        <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded-2xl">
          <MessageCircle className="w-10 h-10 text-gray-300" />
        </div>
      )}

      {/* Bottom row: likes + comments */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="text-gray-600 font-medium">{likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5 text-indigo-500" />
          <span className="text-gray-600 font-medium">{comments}</span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

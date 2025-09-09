import { useState } from "react";
import { Pencil, ImagePlus } from "lucide-react";
import Loader from "../components/Loader";
import { supabase } from "../supabase-client";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    try {
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: storageError } = await supabase.storage
          .from("post-images") 
          .upload(fileName, imageFile);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({ title, content, image_url: imageUrl });

      if (error) throw error;

      console.log("Post created:", data);

      setTitle("");
      setContent("");
      setImageFile(null);
    } catch (err: any) {
      console.error("Error creating post:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Pencil className="w-6 h-6 text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Create a New Post
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Upload Image
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 transition">
                <ImagePlus className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-gray-600">Choose file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {imageFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader text="Publishing..." color="white" />
              </span>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

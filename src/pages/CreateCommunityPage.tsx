import { useState } from "react";
import { supabase } from "../supabase-client";
import { Loader2, AlertCircle } from "lucide-react";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Both name and description are required.");
      return;
    }

    try {
      setIsPending(true);
      setError(null);
      setSuccess(false);

      const { error } = await supabase.from("communities").insert({
        name,
        description
      });

      if (error) throw new Error(error.message);

      setName("");
      setDescription("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto  mt-40 p-6 bg-white/5 rounded-2xl shadow-lg border border-white/10">
      <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Create a Community
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1 text-left">Community Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Enter community name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1 text-left">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Enter a short description"
            rows={4}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-60"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Creating..." : "Create Community"}
        </button>

        {/* Error */}
        {error && (
          <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-400 text-sm mt-2">✅ Community created successfully!</p>
        )}
      </form>
    </div>
  );
};

export default CreateCommunity;

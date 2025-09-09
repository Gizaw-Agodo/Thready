import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading...", color = "gradient" }) => {
  const baseSpinner = "w-5 h-5 animate-spin";

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2
        className={
          color === "gradient"
            ? `${baseSpinner} bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text`
            : `${baseSpinner} text-white`
        }
      />
      <span
        className={
          color === "gradient"
            ? "text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-semibold"
            : "text-white font-semibold"
        }
      >
        {text}
      </span>
    </div>
  );
};

export default  Loader

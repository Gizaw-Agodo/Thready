import toast from "react-hot-toast";
import { XCircle, CheckCircle, Info } from "lucide-react";

// Error Snackbar
export const showError = (message: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 w-80 px-4 py-3 rounded-xl shadow-lg border transition 
      bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white 
      ${t.visible ? "animate-slideIn" : "animate-slideOut"}`}
    >
      <XCircle className="w-6 h-6" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={() => toast.dismiss(t.id)} className="text-white">
        ✕
      </button>
    </div>
  ));
};

// Success Snackbar
export const showSuccess = (message: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 w-80 px-4 py-3 rounded-xl shadow-lg border transition 
      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white 
      ${t.visible ? "animate-slideIn" : "animate-slideOut"}`}
    >
      <CheckCircle className="w-6 h-6" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={() => toast.dismiss(t.id)} className="text-white">
        ✕
      </button>
    </div>
  ));
};

// Info Snackbar
export const showInfo = (message: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 w-80 px-4 py-3 rounded-xl shadow-lg border transition 
      bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white 
      ${t.visible ? "animate-slideIn" : "animate-slideOut"}`}
    >
      <Info className="w-6 h-6" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={() => toast.dismiss(t.id)} className="text-white">
        ✕
      </button>
    </div>
  ));
};

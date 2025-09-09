import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Github, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, signInWithGithub, user } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            Thready
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-indigo-500">
              Home
            </Link>
            <Link to="/posts/create" className="hover:text-indigo-500">
              Create Post
            </Link>
            <Link to="/communities" className="hover:text-indigo-500">
              Communities
            </Link>
            <Link to="/community/create" className="hover:text-indigo-500">
              Create Community
            </Link>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer">
                {/* User Avatar */}
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.email || "User Avatar"}
                  className="w-7 h-7 rounded-full border"
                />
                <span className="font-medium">{user.user_metadata.user_name || "User"}</span>
                <button
                  onClick={signOut}
                  className="p-2 ml-3 cursor-pointer rounded-full hover:bg-gray-300"
                >
                  <LogOut className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent text-black hover:text-indigo-500 border border-indigo-500 hover:cursor-pointer"
                onClick={signInWithGithub}
              >
                <Github className="w-4 h-4" />
                <span>Sign In With GitHub</span>
              </div>
            )}
          </div>
          

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col space-y-3 px-4 py-3 text-gray-700 font-medium">
            <Link
              to="/home"
              className="hover:text-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="hover:text-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              Create Post
            </Link>
            <Link
              to="/community"
              className="hover:text-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/community/community"
              className="hover:text-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/HomePage'
import Navbar from './components/Navbar'
import CreatePost from './pages/CreatePostPage'
import PostDetail from './pages/PostDetailPage'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
     <Toaster
        position="bottom-right"
        toastOptions={{
          className: "rounded-xl shadow-lg",
          style: {
            background: "white",
            color: "#333",
          },
        }}
      />
     <div>
      <Navbar/>
      <div>
        <Routes>
          <Route path = "/" element = {<Home/>} />
          <Route path = "/create" element = {<CreatePost/>} />
          <Route path = "/posts/:id" element = {<PostDetail/>} />
        </Routes>

      </div>
     </div>
    </>
  )
}

export default App

import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/HomePage'
import Navbar from './components/Navbar'
import CreatePost from './pages/CreatePostPage'
import PostDetail from './pages/PostDetailPage'
import { Toaster } from 'react-hot-toast'
import CreateCommunity from './pages/CreateCommunityPage'
import CommunitiesList from './pages/CommunitiesPage'
import CommunityDetail from './pages/CommunityDetail'

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
          <Route path = "/posts/create" element = {<CreatePost/>} />
          <Route path = "/posts/:id" element = {<PostDetail/>} />
          <Route path = "/community/create" element = {<CreateCommunity/>} />
          <Route path = "/communities" element = {<CommunitiesList/>} />
          <Route path = "/communities/:id" element = {<CommunityDetail/>} />
        </Routes>

      </div>
     </div>
    </>
  )
}

export default App

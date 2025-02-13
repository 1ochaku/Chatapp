import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Auth from "./pages/Auth"
import ChatPage from "./pages/ChatPage"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<ChatPage/>}/>
      </Routes>
    </Router>
  )
}

export default App

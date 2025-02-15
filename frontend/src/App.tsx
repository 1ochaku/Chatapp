import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./pages/Auth"
import ChatPage from "./pages/ChatPage"

function App() {
  return (
    <Router>
      <Routes>
        {/* main page */}
        <Route path="/" element={<Auth />} />
        {/* route for login page */}
        <Route path="/chat" element={<ChatPage/>}/>
      </Routes>
    </Router>
  )
}

export default App

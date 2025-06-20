import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddTimer from "./pages/AddTimer";
import History from "./pages/History";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
       <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTimer />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

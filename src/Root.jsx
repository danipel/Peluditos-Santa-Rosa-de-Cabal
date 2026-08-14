import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import App from "./App"

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}


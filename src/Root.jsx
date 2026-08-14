import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import App from "./App"

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}


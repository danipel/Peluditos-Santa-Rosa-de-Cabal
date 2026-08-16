import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import App from "./App"
import ScrollToTop from "./components/layout/ScrollToTop";

export default function Root() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}


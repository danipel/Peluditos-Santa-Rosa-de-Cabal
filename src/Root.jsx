import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./home";
import App from "./App";
import ScrollToTop from "./components/layout/ScrollToTop";

export default function Root() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:ciudad" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

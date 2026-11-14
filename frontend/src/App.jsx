// App.jsx — routes only. Every page sits inside Layout (Navbar + page + Footer).
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import Recommender from "./pages/Recommender.jsx";
import TryModel from "./pages/TryModel.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/recommender" element={<Recommender />} />
        <Route path="/try" element={<TryModel />} />
      </Route>
    </Routes>
  );
}

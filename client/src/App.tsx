import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import RunDetailPage from "./pages/RunDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/runs/:id" element={<RunDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

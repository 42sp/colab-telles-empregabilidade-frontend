import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";
import Configuration from "./pages/configuration";
import ScrapData from "./pages/scrap-data";
import Dashboard from "./pages/dashboard";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />

				<Route path="/login" element={<ScreenLogin />} />
				<Route path="/home" element={<Home />} />
				<Route path="/configuration" element={<Configuration />} />
				<Route path="/scrap-data" element={<ScrapData />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

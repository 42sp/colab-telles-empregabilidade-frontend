import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";
import Import from "./pages/import";
import ScrapData from "./pages/scrap-data";
import Dashboard from "./pages/dashboard";
import { DefaultLayout } from "./components/utils/DefaultLayout";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<ScreenLogin />} />

				{/* Protected routes with sidebar */}
				<Route element={<DefaultLayout />}>
					<Route path="/home" element={<Home />} />
					<Route path="/import" element={<Import />} />
					<Route path="/scrap-data" element={<ScrapData />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

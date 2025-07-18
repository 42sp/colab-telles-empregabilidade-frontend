import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";
import Configuration from "./pages/configuration";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<ScreenLogin />} />
				<Route path="/configuration" element={<Configuration />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

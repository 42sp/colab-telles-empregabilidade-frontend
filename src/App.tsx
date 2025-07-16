import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<ScreenLogin />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

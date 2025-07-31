import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";
import Import from "./pages/import/index";
import ScrapData from "./pages/scrap-data";
import Dashboard from "./pages/dashboard";
import { DefaultLayout } from "./pages/layout/DefaultLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";
import ProtecteRoute from "./components/protecteRoute";

function App() {
	return (
		<SidebarProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ScreenLogin />} />

					<Route element={<DefaultLayout />}>
						<Route
							path="/home"
							element={
								// <ProtecteRoute>
									<Home />
								// </ProtecteRoute>
							}
						/>
						<Route
							path="/import"
							element={
								<ProtecteRoute>
									<Import />
								</ProtecteRoute>
							}
						/>
						<Route
							path="/scrap-data"
							element={
								<ProtecteRoute>
									<ScrapData />
								</ProtecteRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtecteRoute>
									<Dashboard />
								</ProtecteRoute>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</SidebarProvider>
	);
}

export default App;

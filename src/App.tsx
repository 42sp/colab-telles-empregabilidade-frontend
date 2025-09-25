import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenLogin from "./pages/login";
import Home from "./pages/home";
import Import from "./pages/import/index";
import ScrapData from "./pages/scrap-data";
import Dashboard from "./pages/dashboard";
import Chat from "./pages/chat";
import { DefaultLayout } from "./pages/layout/DefaultLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtecteRoute from "./components/protecteRoute";

function App() {
	return (
		<AuthProvider>
			<SidebarProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<ScreenLogin />} />

						<Route element={<DefaultLayout />}>
							<Route
								path="/home"
								element={
									<ProtecteRoute>
										<Home />
									</ProtecteRoute>
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
							<Route
								path="/chat"
								element={
									<ProtecteRoute>
										<Chat />
									</ProtecteRoute>
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</SidebarProvider>
		</AuthProvider>
	);
}

export default App;

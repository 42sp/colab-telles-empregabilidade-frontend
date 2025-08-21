import React, { useEffect, useState } from "react";
import { Field } from "../ui/field";
import { Logo } from "../ui/logo";
import IconsSvg from "@/utils/IconsSvg";
import "./style.css";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const LoginHeader = () => {
	return (
		<div className="login-header-container">
			<Logo />
			<h2 className="login-header-title font-geist">Students Manager</h2>
		</div>
	);
};

const LoginBody = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	
	const { setUser } = useAuth();
	const $service = useServices();
	const navigate = useNavigate();

	useEffect(() => {
		sessionStorage.removeItem("accessToken");
		const login = localStorage.getItem("login");
		if (login) {
			const { email, password, rememberMe } = JSON.parse(login);

			setEmail(email);
			setPassword(password);
			setRememberMe(rememberMe);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await toast.promise(
				$service.postAuthentication({
					email,
					password,
					strategy: "local",
				}),
				{
					pending: "Fazendo login...",
					success: "Login realizado com sucesso 👌",
					error: "Login ou senha incorretos 🤯",
				}
			);

			if ([200, 201].includes(response.status)) {
 
				const responseData = response.data as {
					accessToken: string;
					user: { email: string; name?: string };
				};

				const accessToken = responseData.accessToken;
      			const user = responseData.user;

				sessionStorage.setItem("accessToken", accessToken);
      			setUser(user); // <- salva no contexto

				console.log("Login realizado com sucesso:", response.data);
				if (rememberMe) {
					localStorage.setItem(
						"login",
						JSON.stringify({ email, password, rememberMe })
					);
				} else {
					localStorage.removeItem("login");
				}
				navigate("/home");
			}
		} catch (err) {
			console.error("Erro ao fazer login", err);
		}
	};

	return (
		<div className="max-sm:flex-3 sm:flex-2">
			<ToastContainer position="top-center" hideProgressBar={true} />
			<div className="login-body-Container">
				<h2 className="login-body-Title font-geist">Sign in to your account</h2>

				<form className="login-body-Content" onSubmit={handleSubmit}>
					<Field
						id="email"
						label="Email address"
						type="email"
						placeholder="name@example.com"
						iconPrepend={IconsSvg.email}
						onChange={e => setEmail(e.target.value)}
						value={email}
						required
					/>

					<Field
						id="password"
						label="Password"
						type="password"
						placeholder="••••••••"
						iconPrepend={IconsSvg.password}
						className="mt-[22px]"
						onChange={e => setPassword(e.target.value)}
						value={password}
						required
					/>

					<div className="login-body-rememberMeContainer">
						<div className="login-body-rememberMeCheckboxContainer">
							<Checkbox
								id="remember-me"
								checked={rememberMe}
								onCheckedChange={checked => setRememberMe(!!checked)}
							/>
							<Label
								htmlFor="remember-me"
								className="login-body-rememberMeLabel"
							>
								Remember me
							</Label>
						</div>
						<Link
							to="/forgot-password"
							className="login-body-forgotPasswordLink"
						>
							Forgot password?
						</Link>
					</div>

					<Button type="submit" className="login-body-button">
						Sign In
					</Button>
				</form>
				<div className="login-body-newConnectlyContainer">
					<span className="login-body-newConnectlyTitle">
						New to Connectly?
					</span>{" "}
					<Link to="/register" className="login-body-newConnectlyLink">
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
};

const LoginFooter = () => {
	return (
		<div className="login-footer-container">
			<ShieldCheck className="h-4 w-4 mr-1" color="#6366F1" />
			Secure login • ISO 27001 Certified
		</div>
	);
};

export { LoginHeader, LoginBody, LoginFooter };

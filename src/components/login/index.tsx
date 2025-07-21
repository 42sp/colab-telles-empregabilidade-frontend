import React, { useState } from "react";
import { Field } from "../ui/field";
import { Logo } from "../ui/logo";
import IconsSvg from "@/utils/IconsSvg";
import "./style.css";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Login attempt with:", { email, password, rememberMe });
	};

	return (
		<div className="max-sm:flex-3 sm:flex-2">
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

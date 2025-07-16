import { Field } from "../ui/field";
import { Logo } from "../ui/logo";
import IconsSvg from "@/utils/IconsSvg";
import "./style.css";

const LoginHeader = () => {
	return (
		<>
			<Logo />
			<h2 className="loginHeaderTitle font-geist">Students Manager</h2>
		</>
	);
};

const LoginBody = () => {
	return (
		<div className="loginBodyContainer">
			<h2 className="loginBodyTitle font-geist">Sign in to your account</h2>

			<div className="loginBodyContent">
				<Field
					id="email"
					label="Email address"
					type="email"
					placeholder="name@example.com"
					iconPrepend={IconsSvg.email}
				/>

				<Field
					id="password"
					label="Password"
					type="password"
					placeholder="••••••••"
					iconPrepend={IconsSvg.password}
					className="mt-4"
				/>
			</div>
		</div>
	);
};

export { LoginHeader, LoginBody };

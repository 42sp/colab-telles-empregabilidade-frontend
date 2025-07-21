import { LoginBody, LoginFooter, LoginHeader } from "@/components/login";
import "./style.css";

const ScreenLogin = () => {
	return (
		<div className="pages-login-container">
			<LoginHeader />
			<LoginBody />
			<LoginFooter />
		</div>
	);
};

export default ScreenLogin;

import { LoginBody, LoginFooter, LoginHeader } from "@/components/login";

const ScreenLogin = () => {
	return (
		<div className="flex items-center justify-center flex-col space-y-3 h-[100vh]">
			<LoginHeader />
			<LoginBody />
			<LoginFooter />
		</div>
	);
};

export default ScreenLogin;

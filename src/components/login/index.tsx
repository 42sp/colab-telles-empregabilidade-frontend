import { Field } from "../ui/field";
import { Logo } from "../ui/logo";
import IconsSvg from "@/utils/IconsSvg";

const LoginHeader = () => {
	return (
		<>
			<Logo />

			<h2 className="text-black font-geist text-2xl font-bold leading-[42px] mt-3">
				Students Manager
			</h2>
		</>
	);
}

const LoginBody = () => {
	return (
		<div
			className="w-[450px] h-[456px] mt-[32px] bg-white shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10),0px_4px_6px_-1px_rgba(0,0,0,0.10)] border border-[#E5E7EB] rounded-[8px] p-4"
		>
			<h2
				className="text-[#09090B] font-geist text-[24px] font-semibold leading-[36px] tracking-[-0.6px] text-center"
			>
				Sign in to your account
			</h2>

			<div className='mt-9 flex flex-col items-center'>
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
					className='mt-4'
				/>
			</div>
		</div>
	);
}

export { LoginHeader, LoginBody }
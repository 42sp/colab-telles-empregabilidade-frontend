import IconsSvg from "@/utils/IconsSvg";
import "./style.css";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return (
		<div
			className={`logo-container ${className}`}
			style={{
				background: "linear-gradient(89.99999deg, #6366F1 0%, #4F46E5 100%)",
			}}
		>
			<img src={IconsSvg.logo} className="logoIcon" alt="STA logo" />
		</div>
	);
};

export { Logo };

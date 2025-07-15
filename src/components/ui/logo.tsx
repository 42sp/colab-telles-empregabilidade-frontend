import IconsSvg from '@/utils/IconsSvg';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return (
		<div
			className={`w-[80px] h-[80px] rounded-full flex justify-center items-center ${className}`}
			style={{
				background: 'linear-gradient(89.99999deg, #6366F1 0%, #4F46E5 100%)',
			}}
		>
			<img src={IconsSvg.logo} className="w-[45px] h-[45px]" alt="STA logo" />
		</div>
	)
}

export { Logo }
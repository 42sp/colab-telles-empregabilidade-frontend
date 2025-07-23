import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { MotionProps } from "framer-motion";

interface FadeInOnScrollProps extends MotionProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export function FadeInOnScroll({
	children,
	delay = 0,
	className = "",
	...props
}: FadeInOnScrollProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-20px",
		amount: "some",
	});

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

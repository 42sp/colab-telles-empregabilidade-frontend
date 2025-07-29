import { useEffect, useRef, useState } from "react";

interface LazyLoadWrapperProps {
	children: React.ReactNode;
	className?: string;
	loadingComponent: React.ReactNode;
	forceLoading?: boolean;
}

export function LazyLoadWrapper({
	children,
	className = "",
	loadingComponent,
	forceLoading = false,
}: LazyLoadWrapperProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (forceLoading) {
			// Garante que o layout esteja pronto antes de renderizar
			setTimeout(() => {
				setIsVisible(true);
				window.dispatchEvent(new Event("resize")); // força recalcular o chart
			}, 50);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
					setTimeout(() => {
						window.dispatchEvent(new Event("resize"));
					}, 100);
				}
			},
			{ threshold: 0.1 }
		);

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [forceLoading]);

	return (
		<div ref={ref} className={className}>
			{forceLoading || !isVisible ? loadingComponent : children}
		</div>
	);
}

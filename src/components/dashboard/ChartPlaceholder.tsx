import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChartPlaceholderProps {
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	className?: string;
}

export function ChartPlaceholder({
	title,
	subtitle,
	icon,
	className,
}: ChartPlaceholderProps) {
	return (
		<Card className={`${className} bg-white`}>
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						{icon}
						{title}
					</CardTitle>
					<p className="text-sm text-gray-500">{subtitle}</p>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full" />
			</CardContent>
		</Card>
	);
}

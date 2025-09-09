import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { memo } from "react";
import { Skeleton } from "../ui/skeleton";

export interface MetricCardProps {
	title: string;
	value: string | number;
	description: string;
	icon?: React.ReactNode;
	trend?: number;
	className?: string;
}

export const MetricCard = memo(function MetricCard({
	title,
	value,
	description,
	icon,
	trend,
	className,
}: MetricCardProps) {
	return (
		<Card
			className={`${className} flex min-w-fit shadow-sm rounded-lg bg-white hover:bg-slate-50 transition-colors p-6 max-w-[600px]`}
		>
			<div className="flex items-start  gap-8">
				{(icon && (
					<div className="flex-shrink-0 text-gray-800 bg-gray-200 p-3 rounded-lg mt-2">
						{icon}
					</div>
				)) || <Skeleton className="h-10 w-10" />}
				<div className="flex flex-col">
					<CardHeader className="p-0">
						<span className="text-xl font-semibold text-gray-800 whitespace-nowrap">
							{title || <Skeleton className="h-4 w-[250px]" />}
						</span>
					</CardHeader>

					<CardContent className="p-0 flex gap-4">
						<div className="text-2xl font-bold">{value}</div>
						<div className="flex items-baseline-last text-sm text-gray-500 mt-1">
							{(trend && trend > 0 && (
								<span className="flex items-center text-green-500 mr-1">
									<ArrowUp className="h-3 w-3 mr-0.5" />
									{trend}%
								</span>
							)) ||
								(!title && <Skeleton className="h-4 w-8 mr-1" />)}
							{description || <Skeleton className="h-4 w-[300px]" />}
						</div>
					</CardContent>
				</div>
			</div>
		</Card>
	);
});

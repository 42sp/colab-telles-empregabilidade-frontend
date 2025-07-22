// Helper function
function truncateEmail(email: string): string {
	const [prefix, domain] = email.split("@");
	return `${prefix}@${domain.slice(0, 5)}...`;
}

export const UserProfile = ({
	name,
	email,
	isCollapsed,
}: {
	name: string;
	email: string;
	isCollapsed: boolean;
}) => {
	return (
		<div className="flex items-center px-4 py-4">
			<div className="w-8 h-8 min-w-[2rem] rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-gray-700">
				{name[0].toUpperCase()}
			</div>
			<div
				className={`ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
					isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[180px]"
				}`}
			>
				<div className="flex flex-col">
					<span className="text-sm font-medium">{name}</span>
					<span className="text-xs text-gray-500">{truncateEmail(email)}</span>
				</div>
			</div>
		</div>
	);
};

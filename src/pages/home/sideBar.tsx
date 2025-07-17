import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, LayoutDashboard, Database, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

function	header(title:string)
{
	return (
		<div>
			<h1 className="text-center font-bold font-geist text-2xl">
				{title}
			</h1>
		</div>
	);
}
function	buttons()
{
	const	location = useLocation();
	//Styles
	const	iconStyle: string = "justify-start items-start";
	const	buttonProps ={
		asChild: true,
		variant: "outline",
		size: "ghost",
	};

	//Add new buttons here
	const	links = [
		{ to: "/home", label: "Home", icon: HomeIcon },
		{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ to: "/scrap-data", label: "Scrap Data", icon: Database },
		{ to: "/configuration", label: "Configuração", icon: Settings },
	];
	return (
		<div className="flex flex-col gap-4">
			{links.map(({to, label, icon: Icon}) => {
				const	isActive: boolean = location.pathname === to;
				const	textColour: string = isActive ? "text-black" : "text-zinc-500";
				const buttonStyle: string = `w-full flex items-center gap-2 justify-start font-geist text-base px-4 py-2 ${textColour}`;

				return (
					<Button key={to} {...buttonProps}>
						<Link to={to} className={buttonStyle}>
							<Icon className={iconStyle}/>
							{label}
						</Link>
					</Button>
				);
			})}
		</div>
	);
}
function	showUser(name:string, email:string)
{
	return (
		<div className="flex gap-4">
			<div  className="w-10 h-10 rounded-full bg-indigo-100 shadow flex items-center justify-center">
				{name[0].toUpperCase()}
			</div>
			<div className="flex flex-col">
				<span className="font-medium text-gray-800">{name}</span>
				<span className="text-sm text-gray-400">{email}</span>
			</div>
		</div>
	);
}
export function	SideBar()
{
	//UserInfo - temp data for tests
	//this variables will be recieved as params
	let	userName:string = "Admin";
	let	userEmail:string = "admin@admin.com";

	return (
		<div className="w-64 bg-slate-50 text-black p-4 flex flex-col border border-b border-gray-300 min-h-screen gap-4 shadow-md">
			{header("Manager")}
			<hr className="top-0 left-0 border-slate-300 border-t-2"/>
			{buttons()}
			<hr className="top-0 left-0 border-slate-300 border-t-2"/>
			{showUser(userName, userEmail)}
		</div>
	);
}

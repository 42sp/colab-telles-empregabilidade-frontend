import { StudentsList } from "../../components/home/studentsList";
import { useSidebar } from "../../contexts/SidebarContext"; // Ajuste o caminho conforme necessário

function Home() {
	const { isCollapsed } = useSidebar();

	return (
		<div
			className={`bg-slate-50 contain-layout transition-all duration-300 ${
				isCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-50"
			}`}
		>
			<div className="container mx-auto">
				<div className="w-full">
					<StudentsList />
				</div>
			</div>
		</div>
	);
}

export default Home;

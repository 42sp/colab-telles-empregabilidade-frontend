import { StudentsList } from "./studentsList";
import { useSidebar } from "@/contexts/SidebarContext";

function Home() {
	const { isCollapsed } = useSidebar();

	return (
		<div className={`flex contain-layout ${isCollapsed ? "w-20" : "w-25"}`}>
			<StudentsList />
		</div>
	);
}

export default Home;

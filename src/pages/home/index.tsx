import { StudentsList } from "./studentsList";
import { useSidebar } from "@/contexts/SidebarContext";

function Home() {
	const { isCollapsed } = useSidebar();
	const background: string = "flex flex-wrap flex-1 w-full";

	return (
		<div className="contain-layout">
			<div className={background}>
				<StudentsList />
			</div>
		</div>
	);
}

export default Home;

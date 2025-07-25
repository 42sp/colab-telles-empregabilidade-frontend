import { StudentsList } from "./studentsList";
import { DrawTitle } from "./DrawTitle";

function Home() {
	return (
		<div className="flex flex-col">
			<DrawTitle title={"Lista de estudantes"} />
			<StudentsList />
		</div>
	);
}

export default Home;

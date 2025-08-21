import { StudentsList } from "../../components/home/studentsList";

function Home() {
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

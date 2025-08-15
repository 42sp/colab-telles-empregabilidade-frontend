import { StudentsList } from "./studentsList";

function Home() {
	return (
		<div className="contain-layout container mx-auto flex justify-center items-center overflow-x-hidden">
			<div className={background}>
				<StudentsList />
			</div>
		</div>
	);
}

export default Home;
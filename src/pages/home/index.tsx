import { StudentsList } from "./studentsList";

function Home() {
	return (
		<div className="contain-layout">
			<div className="container mx-auto">
				<div className="w-full">
					<StudentsList />
				</div>
			</div>
		</div>
	);
}

export default Home;
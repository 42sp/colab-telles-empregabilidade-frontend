import { StudentsList } from "../../components/home/studentsList";

function Home() {
	return (
		<div className="contain-layout">
			<div className="container absolute mx-auto h-screen w-screen">
				<div className="w-full">
					<StudentsList />
				</div>
			</div>
		</div>
	);
}

export default Home;

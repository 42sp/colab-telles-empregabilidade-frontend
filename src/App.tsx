import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/ui/button';

function App() {
	const [count, setCount] = useState<number>(0);

	return (
		<div className="flex flex-col justify-center min-h-screen">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-center gap-4">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1 className="text-3xl font-bold text-center">Vite + React</h1>
				<div className="text-center">
					<Button
						className="bg-black text-white py-2 px-4 rounded mb-4"
						onClick={() => setCount(count => count + 1)}
					>
						count is {count}
					</Button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p className="text-center text-gray-500">
					Click on the Vite and React logos to learn more
				</p>
			</div>
		</div>
	);
}

export default App;

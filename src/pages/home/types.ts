import { useEffect, useState } from "react";
import { client } from "@/lib/feathers";

export type drawTitleType = {
	title: string;
	description: string;
};
export const studentsPath = "students";
export const ColumnsPath = "columns" as const;
export type DataContent = string | number | boolean;

export type Data = {
	[key: string]: {
		content: DataContent;
	};
};

export function useStudentsRows(limit: number = 10) {
	const [dataRows, setDataRows] = useState<Data[]>([]);
	const [page, setPage] = useState(0);
	const [columnKeys, setColumnKeys] = useState<string[]>([]);

	useEffect(() => {
		const fetchColumns = async () => {
			try {
				const result = await client.service(ColumnsPath).find();
				const keys = result.data.map(col => col.key);

				setColumnKeys(keys);
			} catch (error) {
				console.log("Erro ao buscar colunas: ", error);
			}
		};
		fetchColumns();
	}, []);

	useEffect(() => {
		if (columnKeys.length === 0) return;

		const fetchStudents = async () => {
			try {
				const result = await client.service(studentsPath).find({
					query: {
						$limit: limit,
						$skip: page * limit,
						$sort: { id: 1 },
					},
				});
				const rows: Data[] = result.data.map(student => {
					const row: Data = {};

					columnKeys.forEach(key => {
						const value = student[key];
						row[key] = {
							content: value as DataContent,
						};
					});
					return row;
				});

				setDataRows(prev => [...prev, ...rows]);
			} catch (error) {
				console.log("Erro ao buscar alunos: ", error);
			}
		};
		fetchStudents();
	}, [page, columnKeys]);

	const loadMore = () => setPage(prev => prev + 1);

	return { dataRows, loadMore };
}

export type StatusType = {
	label: string;
	value: number;
};

export type ButtonType = {
	label: string;
};

export type FilterType = {
	[k in keyof Data]?: string;
};

export type ColumnsMap = {
	[key: string]: {
		label: string;
		isVisible: boolean;
	};
};

export type PropsType = {
	filter: FilterType;
	setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	activeFilter: ColumnKey;
	setActiveFilter: React.Dispatch<React.SetStateAction<ColumnKey>>;
	colums: ColumnsMap;
	setColums: React.Dispatch<React.SetStateAction<ColumnsMap>>;
	filteredRows: Data[];
	setFilteredRows: React.Dispatch<React.SetStateAction<Data[]>>;
};

type ButtonProps = {
	variant: "outline" | "solid" | "ghost"; // ou os valores possíveis no seu design system
	size: "default" | "sm" | "lg"; // idem aqui
};

export type DrawButtonsProps = PropsType & {
	buttonProps: ButtonProps;
};

//DataBases - isso eh um template enquanto n temos os dados
// export const dataRows: Data[] = [
// 	{
// 		name: "Ana Silva",
// 		email: "ana@email.com",
// 		celNumber: "(11) 91234-5678",
// 		gender: "Feminino",
// 		sector: "RH",
// 		orientation: "Heterossexual",
// 		race: "Parda",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/ana",
// 		isWorkin: "Sim",
// 		rent: 3000,
// 		isStudying: true,
// 	},
// 	{
// 		name: "João Souza",
// 		email: "joao@email.com",
// 		celNumber: "(21) 99876-5432",
// 		gender: "Masculino",
// 		sector: "TI",
// 		orientation: "Homosexual",
// 		race: "Branco",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/joao",
// 		isWorkin: "Não",
// 		rent: 4000,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Mariana Costa",
// 		email: "mariana@email.com",
// 		celNumber: "(31) 99911-2233",
// 		gender: "Feminino",
// 		sector: "Marketing",
// 		orientation: "Bissexual",
// 		race: "Negra",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/mariana",
// 		isWorkin: "Sim",
// 		rent: 3500,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Carlos Lima",
// 		email: "carlos@email.com",
// 		celNumber: "(85) 98888-7766",
// 		gender: "Masculino",
// 		sector: "Financeiro",
// 		orientation: "Heterossexual",
// 		race: "Pardo",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/carlos",
// 		isWorkin: "Sim",
// 		rent: 5000,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Beatriz Rocha",
// 		email: "beatriz@email.com",
// 		celNumber: "(51) 99123-4567",
// 		gender: "Feminino",
// 		sector: "Design",
// 		orientation: "Homossexual",
// 		race: "Branca",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/beatriz",
// 		isWorkin: "Não",
// 		rent: 2800,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Rafael Gomes",
// 		email: "rafael@email.com",
// 		celNumber: "(19) 98765-4321",
// 		gender: "Masculino",
// 		sector: "TI",
// 		orientation: "Heterossexual",
// 		race: "Negro",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/rafael",
// 		isWorkin: "Sim",
// 		rent: 6200,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Luana Fernandes",
// 		email: "luana@email.com",
// 		celNumber: "(62) 98456-1234",
// 		gender: "Feminino",
// 		sector: "Jurídico",
// 		orientation: "Bissexual",
// 		race: "Indígena",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/luana",
// 		isWorkin: "Sim",
// 		rent: 4700,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Pedro Henrique",
// 		email: "pedro@email.com",
// 		celNumber: "(27) 99654-7890",
// 		gender: "Masculino",
// 		sector: "Logística",
// 		orientation: "Heterossexual",
// 		race: "Branco",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/pedro",
// 		isWorkin: "Não",
// 		rent: 3200,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Camila Dias",
// 		email: "camila@email.com",
// 		celNumber: "(92) 99345-6789",
// 		gender: "Feminino",
// 		sector: "Engenharia",
// 		orientation: "Homossexual",
// 		race: "Amarela",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/camila",
// 		isWorkin: "Sim",
// 		rent: 5500,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Diego Martins",
// 		email: "diego@email.com",
// 		celNumber: "(14) 98712-3456",
// 		gender: "Masculino",
// 		sector: "Administração",
// 		orientation: "Heterossexual",
// 		race: "Pardo",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/diego",
// 		isWorkin: "Sim",
// 		rent: 3900,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Isabela Andrade",
// 		email: "isabela@email.com",
// 		celNumber: "(61) 99123-9988",
// 		gender: "Feminino",
// 		sector: "Jurídico",
// 		orientation: "Bissexual",
// 		race: "Branca",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/isabela",
// 		isWorkin: "Não",
// 		rent: 2700,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Lucas Almeida",
// 		email: "lucas@email.com",
// 		celNumber: "(67) 98765-1010",
// 		gender: "Masculino",
// 		sector: "TI",
// 		orientation: "Heterossexual",
// 		race: "Pardo",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/lucas",
// 		isWorkin: "Sim",
// 		rent: 6100,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Fernanda Lopes",
// 		email: "fernanda@email.com",
// 		celNumber: "(84) 98877-1122",
// 		gender: "Feminino",
// 		sector: "Design",
// 		orientation: "Homossexual",
// 		race: "Negra",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/fernanda",
// 		isWorkin: "Sim",
// 		rent: 4600,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Tiago Ribeiro",
// 		email: "tiago@email.com",
// 		celNumber: "(45) 99666-7788",
// 		gender: "Masculino",
// 		sector: "Engenharia",
// 		orientation: "Heterossexual",
// 		race: "Branco",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/tiago",
// 		isWorkin: "Não",
// 		rent: 3800,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Juliana Mendes",
// 		email: "juliana@email.com",
// 		celNumber: "(31) 98222-3344",
// 		gender: "Feminino",
// 		sector: "TI",
// 		orientation: "Bissexual",
// 		race: "Indígena",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/juliana",
// 		isWorkin: "Sim",
// 		rent: 5100,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Felipe Costa",
// 		email: "felipe@email.com",
// 		celNumber: "(11) 98888-9999",
// 		gender: "Masculino",
// 		sector: "Financeiro",
// 		orientation: "Heterossexual",
// 		race: "Pardo",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/felipe",
// 		isWorkin: "Sim",
// 		rent: 5300,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Larissa Rocha",
// 		email: "larissa@email.com",
// 		celNumber: "(83) 99777-6655",
// 		gender: "Feminino",
// 		sector: "Marketing",
// 		orientation: "Homossexual",
// 		race: "Amarela",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/larissa",
// 		isWorkin: "Não",
// 		rent: 2900,
// 		isStudying: true,
// 	},
// 	{
// 		name: "André Pinto",
// 		email: "andre@email.com",
// 		celNumber: "(47) 98654-3210",
// 		gender: "Masculino",
// 		sector: "Administração",
// 		orientation: "Heterossexual",
// 		race: "Negro",
// 		pcd: "Sim",
// 		linkedinLink: "linkedin.com/in/andre",
// 		isWorkin: "Sim",
// 		rent: 4100,
// 		isStudying: false,
// 	},
// 	{
// 		name: "Patrícia Silva",
// 		email: "patricia@email.com",
// 		celNumber: "(21) 98444-2233",
// 		gender: "Feminino",
// 		sector: "RH",
// 		orientation: "Bissexual",
// 		race: "Branca",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/patricia",
// 		isWorkin: "Sim",
// 		rent: 3700,
// 		isStudying: true,
// 	},
// 	{
// 		name: "Bruno Oliveira",
// 		email: "bruno@email.com",
// 		celNumber: "(16) 98555-6677",
// 		gender: "Masculino",
// 		sector: "TI",
// 		orientation: "Homossexual",
// 		race: "Pardo",
// 		pcd: "Não",
// 		linkedinLink: "linkedin.com/in/bruno",
// 		isWorkin: "Sim",
// 		rent: 5800,
// 		isStudying: false,
// 	},
// ];

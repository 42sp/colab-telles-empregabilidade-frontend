import { use, useEffect, useState } from "react";
import {
	type ColumnKey,
	type ColumnVisibility,
	type Data,
	type FilterType,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import { useServices } from "@/hooks/useServices";
import type { StudentsParameters } from "@/types/requests";

export function DrawBody() {
	const $service = useServices();
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await $service.students();
				if (JSON.stringify(response.data) !== JSON.stringify(dataRows))
					setDataRows(response.data);
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		})();
	}, []);

	useEffect(() => {
		console.log("Data Rows:", dataRows);
	}, [dataRows]);
	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnVisibility>({
		id: { label: "ID", isVisible: true },
		name: { label: "Nome", isVisible: true },
		socialName: { label: "Nome Social", isVisible: true },
		preferredName: { label: "Nome Preferido", isVisible: true },
		ismartEmail: { label: "Email iSmart", isVisible: true },
		phoneNumber: { label: "Número de Telefone", isVisible: true },
		gender: { label: "Gênero", isVisible: true },
		sexualOrientation: { label: "Orientação Sexual", isVisible: true },
		raceEthnicity: { label: "Raça/Etnia", isVisible: true },
		hasDisability: { label: "PCD", isVisible: true },
		linkedin: { label: "LinkedIn", isVisible: true },
		transferredCourseOrUniversity: {
			label: "Transferência de Curso/Universidade",
			isVisible: true,
		},
		transferDate: { label: "Data de Transferência", isVisible: true },
		currentCourseStart: { label: "Início do Curso Atual", isVisible: true },
		currentCourseStartYear: {
			label: "Ano de Início do Curso Atual",
			isVisible: true,
		},
		currentCourseEnd: { label: "Fim do Curso Atual", isVisible: true },
		currentCourseEndYear: {
			label: "Ano de Fim do Curso Atual",
			isVisible: true,
		},
		supportedCourseFormula: {
			label: "Fórmula do Curso Suportado",
			isVisible: true,
		},
		currentArea: { label: "Área Atual", isVisible: true },
		universityType: { label: "Tipo de Universidade", isVisible: true },
		currentAggregatedCourse: { label: "Curso Agregado Atual", isVisible: true },
		currentDetailedCourse: { label: "Curso Detalhado Atual", isVisible: true },
		currentDetailedUniversity: {
			label: "Universidade Detalhada Atual",
			isVisible: true,
		},
		currentCity: { label: "Cidade Atual", isVisible: true },
		currentState: { label: "Estado Atual", isVisible: true },
		currentCountry: { label: "País Atual", isVisible: true },
		currentAggregatedLocation: {
			label: "Localização Agregada Atual",
			isVisible: true,
		},
		currentShift: { label: "Turno Atual", isVisible: true },
		holderContractStatus: { label: "Status do Contrato", isVisible: true },
		realStatus: { label: "Status Real", isVisible: true },
		realProfile: { label: "Perfil Real", isVisible: true },
		hrProfile: { label: "Perfil RH", isVisible: true },
		targetStatus: { label: "Status Alvo", isVisible: true },
		entryProgram: { label: "Programa de Entrada", isVisible: true },
		projectYears: { label: "Anos de Projeto", isVisible: true },
		entryYearClass: { label: "Ano de Entrada", isVisible: true },
		schoolNetwork: { label: "Rede Escolar", isVisible: true },
		school: { label: "Escola", isVisible: true },
		standardizedSchool: { label: "Escola Padronizada", isVisible: true },
		groupedLocation: { label: "Localização Agrupada", isVisible: true },
		specificLocation: { label: "Localização Específica", isVisible: true },
		duplicatedTargetStatus: { label: "Status Alvo Duplicado", isVisible: true },
		duplicatedCurrentStatus: {
			label: "Status Atual Duplicado",
			isVisible: true,
		},
		targetAudience: { label: "Público Alvo", isVisible: true },
		working: { label: "Trabalhando", isVisible: true },
		opportunityType: { label: "Tipo de Oportunidade", isVisible: true },
		details: { label: "Detalhes", isVisible: true },
		sector: { label: "Setor", isVisible: true },
		careerTrack: { label: "Trilha de Carreira", isVisible: true },
		organization: { label: "Organização", isVisible: true },
		website: { label: "Website", isVisible: true },
		startDate: { label: "Data de Início", isVisible: true },
		endDate: { label: "Data de Fim", isVisible: true },
		compensation: { label: "Compensação", isVisible: true },
		partnerCompanies: { label: "Empresas Parceiras", isVisible: true },
		topGlobalCompanies: {
			label: "Principais Empresas Globais",
			isVisible: true,
		},
		comments: { label: "Comentários", isVisible: true },
		tag: { label: "Tag", isVisible: true },
		jan: { label: "Janeiro", isVisible: true },
		feb: { label: "Fevereiro", isVisible: true },
		mar: { label: "Março", isVisible: true },
		apr: { label: "Abril", isVisible: true },
		may: { label: "Maio", isVisible: true },
		jun: { label: "Junho", isVisible: true },
		jul: { label: "Julho", isVisible: true },
		aug: { label: "Agosto", isVisible: true },
		sep: { label: "Setembro", isVisible: true },
		oct: { label: "Outubro", isVisible: true },
		nov: { label: "Novembro", isVisible: true },
		dec: { label: "Dezembro", isVisible: true },
		january: { label: "Janeiro", isVisible: true },
		february: { label: "Fevereiro", isVisible: true },
		march: { label: "Março", isVisible: true },
		april: { label: "Abril", isVisible: true },
		mayFull: { label: "Maio", isVisible: true },
		june: { label: "Junho", isVisible: true },
		july: { label: "Julho", isVisible: true },
		august: { label: "Agosto", isVisible: true },
		september: { label: "Setembro", isVisible: true },
		october: { label: "Outubro", isVisible: true },
		november: { label: "Novembro", isVisible: true },
		december: { label: "Dezembro", isVisible: true },
		january2: { label: "Janeiro 2", isVisible: true },
		february2: { label: "Fevereiro 2", isVisible: true },
		march2: { label: "Março 2", isVisible: true },
		april2: { label: "Abril 2", isVisible: true },
		may2: { label: "Maio 2", isVisible: true },
		june2: { label: "Junho 2", isVisible: true },
		july2: { label: "Julho 2", isVisible: true },
		august2: { label: "Agosto 2", isVisible: true },
		september2: { label: "Setembro 2", isVisible: true },
		october2: { label: "Outubro 2", isVisible: true },
		november2: { label: "Novembro 2", isVisible: true },
		december2: { label: "Dezembro 2", isVisible: true },
		internshipUnavailabilityReason: {
			label: "Motivo de Indisponibilidade de Estágio",
			isVisible: true,
		},
		careerTrajectoryInterests: {
			label: "Interesses de Trajetória de Carreira",
			isVisible: true,
		},
		primaryInterest: { label: "Interesse Primário", isVisible: true },
		secondaryInterest: { label: "Interesse Secundário", isVisible: true },
		intendedWorkingAreas: {
			label: "Áreas de Trabalho Pretendidas",
			isVisible: true,
		},
		additionalAreaInterests: {
			label: "Interesses Adicionais de Área",
			isVisible: true,
		},
		seekingProfessionalOpportunity: {
			label: "Buscando Oportunidade Profissional",
			isVisible: true,
		},
		opportunitiesLookingFor: {
			label: "Oportunidades Procuradas",
			isVisible: true,
		},
		opportunityDetails: { label: "Detalhes da Oportunidade", isVisible: true },
		languages: { label: "Idiomas", isVisible: true },
		technicalKnowledge: { label: "Conhecimento Técnico", isVisible: true },
		officePackageKnowledge: {
			label: "Conhecimento em Pacote Office",
			isVisible: true,
		},
		wordProficiencyLevel: {
			label: "Nível de Proficiência em Word",
			isVisible: true,
		},
		excelProficiencyLevel: {
			label: "Nível de Proficiência em Excel",
			isVisible: true,
		},
		powerPointProficiencyLevel: {
			label: "Nível de Proficiência em PowerPoint",
			isVisible: true,
		},
	});
	// const [filter, setFilter] = useState<FilterType>(() => {
	// 	const initialFilter = Object.fromEntries(
	// 		(Object.keys(colums) as ColumnKey[]).map(key => [key as ColumnKey, ""])
	// 	) as FilterType;

	// 	return initialFilter as FilterType;
	// });

	const [activeFilter, setActiveFilter] = useState<ColumnKey>("name");

	const [filter, setFilter] = useState<FilterType>(() => {
		const saved = sessionStorage.getItem("userFilter");

		if (saved) {
			try {
				return JSON.parse(saved) as FilterType;
			} catch (error) {
				console.log(error);
			}
		}

		const initialFilter = Object.fromEntries(
			(Object.keys(colums) as ColumnKey[]).map(key => [key as ColumnKey, ""])
		) as FilterType;

		return initialFilter as FilterType;
	});

	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);

	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		const newFiltered = dataRows.filter((row: (typeof dataRows)[number]) => {
			// Filtro por campo
			const matches = (Object.entries(filter) as [keyof Data, string][]).every(
				([field, value]) => {
					if (!value) return true;

					const rowValue = row[field];
					if (rowValue === undefined || rowValue === null) return false;

					return String(rowValue).toLowerCase().includes(value.toLowerCase());
				}
			);

			// Filtro por status
			const matchStatus =
				activeLabel === "Todos"
					? true
					: activeLabel === "Ativos"
						? row.isStudying === true
						: row.isStudying === false;

			return matches && matchStatus;
		});

		setFilteredRows(newFiltered);
	}, [filter, activeLabel, dataRows]);

	const background: string =
		"flex flex-col bg-white w-full min-h-screen max-w-full p-4 gap-4 overflow-hidden";
	return (
		<div className={background}>
			<DrawStatus
				activeLabel={activeLabel}
				setActiveLabel={setActiveLabel}
				filteredRows={filteredRows}
				dataRows={dataRows}
			/>
			<SearchBar
				filter={filter}
				setFilter={setFilter}
				page={page}
				setPage={setPage}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
				colums={colums}
				setColums={setColums}
				setFilteredRows={setFilteredRows}
				filteredRows={filteredRows}
			/>
		</div>
	);
}

import { useEffect, useState } from "react";
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
	//#region States
	const $service = useServices();
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);
	const rowsToGet: number = 30;

	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnVisibility>({
		name: { label: "Nome", isVisible: true },
		socialName: { label: "Nome Social", isVisible: true },
		preferredName: { label: "Nome Preferido", isVisible: false },
		ismartEmail: { label: "Email iSmart", isVisible: true }, // Assumindo que é o email
		phoneNumber: { label: "Número de Telefone", isVisible: true },
		gender: { label: "Gênero", isVisible: true },
		sexualOrientation: { label: "Orientação Sexual", isVisible: true },
		raceEthnicity: { label: "Raça/Etnia", isVisible: true },
		hasDisability: { label: "PCD", isVisible: true },
		linkedin: { label: "LinkedIn", isVisible: true },
		transferredCourseOrUniversity: {
			label: "Transferência de Curso/Universidade",
			isVisible: false,
		},
		transferDate: { label: "Data de Transferência", isVisible: false },
		currentCourseStart: { label: "Início do Curso Atual", isVisible: false },
		currentCourseStartYear: {
			label: "Ano de Início do Curso Atual",
			isVisible: false,
		},
		currentCourseEnd: { label: "Fim do Curso Atual", isVisible: false },
		currentCourseEndYear: {
			label: "Ano de Fim do Curso Atual",
			isVisible: false,
		},
		supportedCourseFormula: {
			label: "Fórmula do Curso Suportado",
			isVisible: false,
		},
		currentArea: { label: "Área Atual", isVisible: true },
		universityType: { label: "Tipo de Universidade", isVisible: false },
		currentAggregatedCourse: {
			label: "Curso Agregado Atual",
			isVisible: false,
		},
		currentDetailedCourse: { label: "Curso Detalhado Atual", isVisible: false },
		currentDetailedUniversity: {
			label: "Universidade Detalhada Atual",
			isVisible: false,
		},
		currentCity: { label: "Cidade Atual", isVisible: true },
		currentState: { label: "Estado Atual", isVisible: true },
		currentCountry: { label: "País Atual", isVisible: true },
		currentAggregatedLocation: {
			label: "Localização Agregada Atual",
			isVisible: false,
		},
		currentShift: { label: "Turno Atual", isVisible: false },
		holderContractStatus: { label: "Status do Contrato", isVisible: true },
		realStatus: { label: "Status Real", isVisible: true },
		realProfile: { label: "Perfil Real", isVisible: false },
		hrProfile: { label: "Perfil RH", isVisible: false },
		targetStatus: { label: "Status Alvo", isVisible: false },
		entryProgram: { label: "Programa de Entrada", isVisible: false },
		projectYears: { label: "Anos de Projeto", isVisible: false },
		entryYearClass: { label: "Ano de Entrada", isVisible: false },
		schoolNetwork: { label: "Rede Escolar", isVisible: false },
		school: { label: "Escola", isVisible: false },
		standardizedSchool: { label: "Escola Padronizada", isVisible: false },
		groupedLocation: { label: "Localização Agrupada", isVisible: false },
		specificLocation: { label: "Localização Específica", isVisible: false },
		duplicatedTargetStatus: {
			label: "Status Alvo Duplicado",
			isVisible: false,
		},
		duplicatedCurrentStatus: {
			label: "Status Atual Duplicado",
			isVisible: false,
		},
		targetAudience: { label: "Público Alvo", isVisible: false },
		working: { label: "Trabalhando", isVisible: true },
		opportunityType: { label: "Tipo de Oportunidade", isVisible: false },
		details: { label: "Detalhes", isVisible: false },
		sector: { label: "Setor", isVisible: true },
		careerTrack: { label: "Trilha de Carreira", isVisible: false },
		organization: { label: "Organização", isVisible: true },
		website: { label: "Website", isVisible: false },
		startDate: { label: "Data de Início", isVisible: false },
		endDate: { label: "Data de Fim", isVisible: false },
		compensation: { label: "Compensação", isVisible: true },
		partnerCompanies: { label: "Empresas Parceiras", isVisible: true },
		topGlobalCompanies: {
			label: "Principais Empresas Globais",
			isVisible: false,
		},
		comments: { label: "Comentários", isVisible: false },
		tag: { label: "Tag", isVisible: false },
		jan: { label: "Janeiro", isVisible: false },
		feb: { label: "Fevereiro", isVisible: false },
		mar: { label: "Março", isVisible: false },
		apr: { label: "Abril", isVisible: false },
		may: { label: "Maio", isVisible: false },
		jun: { label: "Junho", isVisible: false },
		jul: { label: "Julho", isVisible: false },
		aug: { label: "Agosto", isVisible: false },
		sep: { label: "Setembro", isVisible: false },
		oct: { label: "Outubro", isVisible: false },
		nov: { label: "Novembro", isVisible: false },
		dec: { label: "Dezembro", isVisible: false },
		january: { label: "Janeiro", isVisible: false },
		february: { label: "Fevereiro", isVisible: false },
		march: { label: "Março", isVisible: false },
		april: { label: "Abril", isVisible: false },
		mayFull: { label: "Maio", isVisible: false },
		june: { label: "Junho", isVisible: false },
		july: { label: "Julho", isVisible: false },
		august: { label: "Agosto", isVisible: false },
		september: { label: "Setembro", isVisible: false },
		october: { label: "Outubro", isVisible: false },
		november: { label: "Novembro", isVisible: false },
		december: { label: "Dezembro", isVisible: false },
		january2: { label: "Janeiro 2", isVisible: false },
		february2: { label: "Fevereiro 2", isVisible: false },
		march2: { label: "Março 2", isVisible: false },
		april2: { label: "Abril 2", isVisible: false },
		may2: { label: "Maio 2", isVisible: false },
		june2: { label: "Junho 2", isVisible: false },
		july2: { label: "Julho 2", isVisible: false },
		august2: { label: "Agosto 2", isVisible: false },
		september2: { label: "Setembro 2", isVisible: false },
		october2: { label: "Outubro 2", isVisible: false },
		november2: { label: "Novembro 2", isVisible: false },
		december2: { label: "Dezembro 2", isVisible: false },
		internshipUnavailabilityReason: {
			label: "Motivo de Indisponibilidade de Estágio",
			isVisible: false,
		},
		careerTrajectoryInterests: {
			label: "Interesses de Trajetória de Carreira",
			isVisible: false,
		},
		primaryInterest: { label: "Interesse Primário", isVisible: false },
		secondaryInterest: { label: "Interesse Secundário", isVisible: false },
		intendedWorkingAreas: {
			label: "Áreas de Trabalho Pretendidas",
			isVisible: false,
		},
		additionalAreaInterests: {
			label: "Interesses Adicionais de Área",
			isVisible: false,
		},
		seekingProfessionalOpportunity: {
			label: "Buscando Oportunidade Profissional",
			isVisible: false,
		},
		opportunitiesLookingFor: {
			label: "Oportunidades Procuradas",
			isVisible: false,
		},
		opportunityDetails: { label: "Detalhes da Oportunidade", isVisible: false },
		languages: { label: "Idiomas", isVisible: true },
		technicalKnowledge: { label: "Conhecimento Técnico", isVisible: false },
		officePackageKnowledge: {
			label: "Conhecimento em Pacote Office",
			isVisible: false,
		},
		wordProficiencyLevel: {
			label: "Nível de Proficiência em Word",
			isVisible: false,
		},
		excelProficiencyLevel: {
			label: "Nível de Proficiência em Excel",
			isVisible: false,
		},
		powerPointProficiencyLevel: {
			label: "Nível de Proficiência em PowerPoint",
			isVisible: false,
		},
	});

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
	//#endregion

	//#region useEffects
	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);

	//Requisicao no back-end dos dados pre-filtrados
	useEffect(() => {
		(async () => {
			try {
				console.log("activeLabel:", activeLabel);
				const allFilter = {
					$limit: rowsToGet,
				};

				if (activeLabel !== "Todos") {
					const statusValue = activeLabel === "Ativos" ? "Ativo" : "Inativo";

					allFilter.holderContractStatus = {
						$regex: statusValue,
						$options: "i",
					};
				}
				const translateFilter = (value: string) => {
					const lower: string = value.toLowerCase();
					const translations = new Map<string, boolean>([
						["sim", true],
						["não", false],
						["nao", false],
					]);

					return translations.get(lower) ?? value;
				};
				Object.keys(filter).forEach(key => {
					const trimKey = filter[key]?.trim();
					if (filter[key] && trimKey !== "") {
						const translated = translateFilter(filter[key]);

						if (typeof translated === "string")
							allFilter[key] = {
								$regex: translated,
								$options: "i",
							};
						else allFilter[key] = translated;
					}
				});
				const response = await $service.students(allFilter);
				if (JSON.stringify(response.data) !== JSON.stringify(dataRows))
					setDataRows(response.data.data);
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		})();
	}, [filter, rowsToGet, activeLabel, activeFilter]);

	useEffect(() => {
		console.log("Data Rows:", dataRows);
	}, [dataRows]);

	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		setFilteredRows(dataRows);
	}, [dataRows]);

	//#endregion
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

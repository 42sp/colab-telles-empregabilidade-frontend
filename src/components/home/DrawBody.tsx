import { useCallback, useEffect, useState } from "react";
import {
	booleanFields,
	type ColumnKey,
	type ColumnVisibility,
	type FilterType,
	type Stats,
	type StudentsQuery,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import { useServices } from "@/hooks/useServices";
import type { StudentsParameters } from "@/types/requests";

export function DrawBody() {
	//#region States
	const $service = useServices();
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);
	const [stats, setStats] = useState<Stats>({
		total: 0,
		working: 0,
		notWorking: 0,
		avgCompensation: 0,
	});

	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnVisibility>(() => {
		const savedColumns = sessionStorage.getItem("userColumns");

		if (savedColumns) {
			try {
				return JSON.parse(savedColumns) as ColumnVisibility;
			} catch (error) {
				console.log("Error: couldn't load the saved columns: ", error);
			}
		}

		return {
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
			currentDetailedCourse: {
				label: "Curso Detalhado Atual",
				isVisible: false,
			},
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
			opportunityDetails: {
				label: "Detalhes da Oportunidade",
				isVisible: false,
			},
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
		};
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

	//Salva as colunas
	useEffect(() => {
		sessionStorage.setItem("userColumns", JSON.stringify(colums));
	}, [colums]);

	//Salva os filtros
	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);

	const rowsPerPage: number = 10;
	const buildQuery = useCallback(
		(skipIndex: number): StudentsQuery => {
			const q: StudentsQuery = {
				$limit: rowsPerPage,
				$skip: skipIndex,
			};
			if (activeLabel === "Formados") {
				q.realStatus = { $ilike: `formad%` };
			} else if (activeLabel !== "Todos") {
				q.holderContractStatus = {
					$ilike: activeLabel === "Ativos" ? "Ativ%" : "Inativ%",
				};
			}

			const translate = (value: string) => {
				const lower = value.trim().toLowerCase();
				if (lower === "sim") return true;
				else if (["não", "nao"].includes(lower)) return false;
				return value;
			};
			for (const key of Object.keys(filter)) {
				const value: string = filter[key]?.trim() ?? "";
				if (!value) continue;

				const translated: string | boolean = translate(value);
				if (booleanFields.has(key)) {
					if (typeof translated === "boolean") q[key] = translated;
				} else if (value) q[key] = { $ilike: `${translated}%` };
			}

			return q;
		},
		[activeLabel, filter]
	);

	const fetchData = useCallback(
		async (skipIndex: number) => {
			try {
				const query = buildQuery(skipIndex);
				const response = await $service.students(query);
				setDataRows(response.data.data);
				return query;
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		},
		[$service, buildQuery]
	);

	const fetchStats = useCallback(async () => {
		try {
			const query = buildQuery(0);
			const response = await $service.studentsStats(query);

			setStats({
				total: response.data.total,
				working: response.data.working,
				notWorking: response.data.notWorking,
				avgCompensation: Number(response.data.avgCompensation),
			});
		} catch (error) {
			console.error("Failed to fetch students:", error);
		}
	}, [$service, buildQuery]);

	let query: StudentsQuery;
	const [debounce, setDebounce] = useState(filter);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounce(filter);
		}, 150);

		return () => clearTimeout(timer);
	}, [filter]);

	useEffect(() => {
		setPage(0);
	}, [activeLabel]);
	useEffect(() => {
		// fetchStats();
		const fetch = async () => {
			try {
				await fetchStats();
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		};
		fetch();
	}, [debounce, activeLabel, activeFilter]);
	useEffect(() => {
		const run = async () => {
			const q: StudentsQuery = await fetchData(page * rowsPerPage);
			query = q;
		};
		run();
	}, [filter, activeLabel, activeFilter, page]);

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
				stats={stats}
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
				stats={stats}
				query={query}
			/>
		</div>
	);
}

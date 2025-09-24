import type { StudentsParameters } from "@/types/requests";

export type drawTitleType = {
	title: string;
	description: string;
};

export type Data = {
	[key: string]: {
		data: string | number | boolean;
	};
};

export type StatusType = {
	label: string;
	value: number;
};

export type ButtonType = {
	label: string;
};

export type ColumnKey =
	| "name"
	| "socialName"
	| "preferredName"
	| "ismartEmail"
	| "phoneNumber"
	| "gender"
	| "sexualOrientation"
	| "raceEthnicity"
	| "hasDisability"
	| "linkedin"
	| "transferredCourseOrUniversity"
	| "transferDate"
	| "currentCourseStart"
	| "currentCourseStartYear"
	| "currentCourseEnd"
	| "currentCourseEndYear"
	| "supportedCourseFormula"
	| "currentArea"
	| "universityType"
	| "currentAggregatedCourse"
	| "currentDetailedCourse"
	| "currentDetailedUniversity"
	| "currentCity"
	| "currentState"
	| "currentCountry"
	| "currentAggregatedLocation"
	| "currentShift"
	| "holderContractStatus"
	| "realStatus"
	| "realProfile"
	| "hrProfile"
	| "targetStatus"
	| "entryProgram"
	| "projectYears"
	| "entryYearClass"
	| "schoolNetwork"
	| "school"
	| "standardizedSchool"
	| "groupedLocation"
	| "specificLocation"
	| "duplicatedTargetStatus"
	| "duplicatedCurrentStatus"
	| "targetAudience"
	| "working"
	| "opportunityType"
	| "details"
	| "sector"
	| "careerTrack"
	| "organization"
	| "website"
	| "startDate"
	| "endDate"
	| "compensation"
	| "partnerCompanies"
	| "topGlobalCompanies"
	| "comments"
	| "tag"
	| "jan"
	| "feb"
	| "mar"
	| "apr"
	| "may"
	| "jun"
	| "jul"
	| "aug"
	| "sep"
	| "oct"
	| "nov"
	| "dec"
	| "january"
	| "february"
	| "march"
	| "april"
	| "mayFull"
	| "june"
	| "july"
	| "august"
	| "september"
	| "october"
	| "november"
	| "december"
	| "january2"
	| "february2"
	| "march2"
	| "april2"
	| "may2"
	| "june2"
	| "july2"
	| "august2"
	| "september2"
	| "october2"
	| "november2"
	| "december2"
	| "internshipUnavailabilityReason"
	| "careerTrajectoryInterests"
	| "primaryInterest"
	| "secondaryInterest"
	| "intendedWorkingAreas"
	| "additionalAreaInterests"
	| "seekingProfessionalOpportunity"
	| "opportunitiesLookingFor"
	| "opportunityDetails"
	| "languages"
	| "technicalKnowledge"
	| "officePackageKnowledge"
	| "wordProficiencyLevel"
	| "excelProficiencyLevel"
	| "powerPointProficiencyLevel";

export type ColumnVisibility = {
	[key in ColumnKey]: {
		label: string;
		isVisible: boolean;
	};
};

export const booleanFields = new Set([
	"hasDisability",
	"transferredCourseOrUniversity",
	"working",
]);

export const numberFields = new Set([
	"currentCourseStartYear",
	"currentCourseEndYear",
	"projectYears",
]);

export type FilterType = {
	[k in keyof Data]?: string;
};

export interface StudentsQuery {
	$limit?: number;
	$skip?: number;
	$sort?: Record<string, 1 | -1>;
	holderContractStatus?: string;
	working?: boolean;
	[key: string]: string | number | boolean | undefined | Record<string, any>;
}

export type Stats = {
	total: number;
	working: number;
	notWorking: number;
	avgCompensation: number;
};

export type StateBundle = {
	filter: FilterType;
	setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	activeFilter: ColumnKey;
	setActiveFilter: React.Dispatch<React.SetStateAction<ColumnKey>>;
	colums: ColumnVisibility;
	setColums: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
	filteredRows: StudentsParameters[];
	setFilteredRows: React.Dispatch<React.SetStateAction<StudentsParameters[]>>;
	activeLabel: string;
	setActiveLabel: React.Dispatch<React.SetStateAction<string>>;
	stats: Stats;
	query: StudentsQuery;
	updateHome: () => void;
};

type ButtonProps = {
	variant: "outline" | "solid" | "ghost"; // ou os valores possíveis no seu design system
	size: "default" | "sm" | "lg"; // idem aqui
};

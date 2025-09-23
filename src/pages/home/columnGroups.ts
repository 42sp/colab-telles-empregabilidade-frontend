import type { ColumnKey } from "./types";

export const columnGroups: Record<string, (ColumnKey | { [sub: string]: ColumnKey[] })[]> = {
  "Dados Pessoais": [
    "name",
    "socialName",
    "preferredName",
    "ismartEmail",
    "phoneNumber",
    "gender",
    "sexualOrientation",
    "raceEthnicity",
    "hasDisability",
    "linkedin",
  ],

  "Acadêmico": [
    "transferredCourseOrUniversity",
    "transferDate",
    "currentCourseStart",
    "currentCourseStartYear",
    "currentCourseEnd",
    "currentCourseEndYear",
    "supportedCourseFormula",
    "currentArea",
    "universityType",
    "currentAggregatedCourse",
    "currentDetailedCourse",
    "currentDetailedUniversity",
  ],

  "Localização": [
    "currentCity",
    "currentState",
    "currentCountry",
    "currentAggregatedLocation",
    "groupedLocation",
    "specificLocation",
  ],

  "Turno e Status": [
    "currentShift",
    "holderContractStatus",
    "realStatus",
    "realProfile",
    "hrProfile",
    "targetStatus",
    "duplicatedTargetStatus",
    "duplicatedCurrentStatus",
    "targetAudience",
  ],

  "Entrada e Escola": [
    "entryProgram",
    "projectYears",
    "entryYearClass",
    "schoolNetwork",
    "school",
    "standardizedSchool",
  ],

  "Profissional": [
    "working",
    "opportunityType",
    "details",
    "sector",
    "careerTrack",
    "organization",
    "website",
    "startDate",
    "endDate",
    "compensation",
    "partnerCompanies",
    "topGlobalCompanies",
  ],

  "Conhecimentos e Idiomas": [
    "languages",
    "technicalKnowledge",
    "officePackageKnowledge",
    "wordProficiencyLevel",
    "excelProficiencyLevel",
    "powerPointProficiencyLevel",
  ],

  "Oportunidades": [
    "internshipUnavailabilityReason",
    "careerTrajectoryInterests",
    "primaryInterest",
    "secondaryInterest",
    "intendedWorkingAreas",
    "additionalAreaInterests",
    "seekingProfessionalOpportunity",
    "opportunitiesLookingFor",
    "opportunityDetails",
  ],

  "Comentários": ["comments", "tag"],

  "Cronograma": [
    { "Mensal (abreviado)": ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] },
    { "Mensal (extenso)": ["january","february","march","april","mayFull","june","july","august","september","october","november","december"] },
    { "Mensal (série 2)": ["january2","february2","march2","april2","may2","june2","july2","august2","september2","october2","november2","december2"] },
  ],
};

export type ColumnGroupType = Record<string, (ColumnKey | { [subgroup: string]: ColumnKey[] })[]>;

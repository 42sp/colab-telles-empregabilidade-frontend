/**
 * Tipo que representa uma operação/scrap no frontend.
 * Mantenha em sincronia com o backend (scrapOperations.schema.ts).
 */
export type Operation = {
	// id numérico primário do banco (se o Knex/Supabase retornar 'id' use este)
	id: string;

	// uuid público
	uuid: string;

	// campos principais
	name: string;
	scheduled_date: string; // "YYYY-MM-DD"
	scheduled_time: string; // "HH:mm"
	user_tag: string;
	repeat_days: string;
	repeat_time: string;

	// campos opcionais do schema
	status?: "Agendado" | "Em Execução" | "Concluído" | "Falha";
	started_at?: string | null; // date-time iso ou null
	finished_at?: string | null; // date-time iso ou null
	result?: Record<string, any>;
	error_message?: string | null;

	last_occurrence?: string | null; // "YYYY-MM-DD" ou null
	last_occurrence_price?: number | string | null; // número ou string formatada

	// Caso seu adapter retorne _id em vez de id, você pode mapear depois
	_id?: number;
};

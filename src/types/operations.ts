/**
 * Tipo que representa uma operação/scrap no frontend.
 * Mantenha em sincronia com o backend (scrapOperations.schema.ts).
 */
export type Operation = {
  // ------------------------------
  // 🔹 Identificação
  // ------------------------------
  id: number | string;          // id numérico primário do banco
  uuid?: string;       // uuid público
  name: string;        // nome da operação
  type: string;       // tipo da operação
  status?: "Agendado" | "Em Execução" | "Concluído" | "Falha" |  "Excluída" | "Vencida"; // status da operação
  user_tag: string;    // identificação do usuário que solicitou

  // ------------------------------
  // 🔹 Agendamento
  // ------------------------------
  scheduled_date: string; // "YYYY-MM-DD"
  scheduled_time: string; // "HH:mm"
  repeat_days?: string;   // dias para repetição
  repeat_time?: string;   // hora da repetição

  // ------------------------------
  // 🔹 Execução e Resultado
  // ------------------------------
  started_at?: string | null; // ISO date-time
  finished_at?: string | null; // ISO date-time
  result?: Record<string, any>; 
  error_message?: string | null;

  // ------------------------------
  // 🔹 Auditoria
  // ------------------------------
  created_by?: string;     // usuário que criou a operação
  created_at: string;     // data/hora da criação
  last_edited_by?: string; // último usuário que editou
  last_edited_at?: string; // data/hora da última edição

  // ------------------------------
  // 🔹 Deleção
  // ------------------------------
  deleted?: boolean;       // flag de deleção
  deleted_by?: string;     // usuário que deletou
  deleted_at?: string;     // data/hora da deleção

  // ------------------------------
  // 🔹 Campos extras do frontend
  // ------------------------------
  last_occurrence?: string | null;        // "YYYY-MM-DD" ou null
  last_occurrence_price?: number | string | null; // valor numérico ou formatado
};

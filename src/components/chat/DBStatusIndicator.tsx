import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

// Pega a URL do backend do ToolFront dependendo do ambiente
const TOOLFRONT_API_URL = import.meta.env.VITE_TOOLFRONT_API_URL;

export function DBStatusIndicator() {
  const [status, setStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = async () => {
    setStatus("checking");
    try {
      // Primeira checagem
      const res = await fetch(`${TOOLFRONT_API_URL}/health`);
      const data = await res.json();

      // Se não estiver conectado, tenta reconectar
      if (data.status !== "connected") {
        const reconnect = await fetch(`${TOOLFRONT_API_URL}/reconnect-db`, {
          method: "POST",
        });
        const reconnectData = await reconnect.json();
        setStatus(reconnectData.db_connected ? "connected" : "disconnected");
        setLastCheck(new Date());
        return;
      }

      setStatus("connected");
      setLastCheck(new Date());
    } catch {
      setStatus("disconnected");
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const statusColorMap = {
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    checking: "bg-gray-400 animate-pulse",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-between gap-4 px-4 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <div className={`w-3 h-3 rounded-full ${statusColorMap[status]}`} />
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-1 p-0 h-auto text-gray-600 hover:bg-transparent hover:text-gray-900"
              onClick={checkStatus}
              disabled={status === "checking"}
            >
              <RefreshCcw
                className={`w-4 h-4 ${status === "checking" ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Checar</span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-sm">
          <div>
            Status:{" "}
            {status === "connected"
              ? "Conectado"
              : status === "disconnected"
              ? "Desconectado"
              : "Verificando..."}
          </div>
          {lastCheck && (
            <div className="text-xs text-gray-500">
              Última checagem: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

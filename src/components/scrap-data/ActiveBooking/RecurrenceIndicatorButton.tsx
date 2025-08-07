import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Repeat } from "lucide-react";

type Props = {
  isRecurring: boolean;
};

export function RecurrenceIndicatorButton({ isRecurring }: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={isRecurring ? "success" : "outline"}
            aria-label="Indicador de recorrência"
            className={`${
              isRecurring ? "bg-green-500" : "bg-gray-100"
            } text-white`}
          >
            <Repeat 
              className={`w-4 h-4 ${isRecurring ? "text-white" : "text-gray-400"}`} 
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isRecurring ? "Recorrência ativa" : "Sem recorrência"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

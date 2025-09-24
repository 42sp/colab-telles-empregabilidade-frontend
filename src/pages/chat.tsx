import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Message } from "@/components/chat/types";
import { DBStatusIndicator } from "@/components/chat/DBStatusIndicator"; 
const VITE_TOOLFRONT_API_URL = import.meta.env.VITE_TOOLFRONT_API_URL ;

interface TableMessageType {
  colunas: string[];
  dados: string[][];
}

interface ChatMessage extends Message {
  tabela?: TableMessageType;
}

// Componente para exibir tabela
function TableMessage({ tabela }: { tabela: TableMessageType }) {
  return (
    <div className="overflow-x-auto border rounded-md mt-2">
      <table className="table-auto w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            {tabela.colunas.map((col, i) => (
              <th key={i} className="px-4 py-2 border">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabela.dados.map((linha, i) => (
            <tr key={i} className="even:bg-gray-50">
              {linha.map((celula, j) => (
                <td key={j} className="px-4 py-2 border">
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    console.log("API URL usada:", VITE_TOOLFRONT_API_URL);
    console.log("URL completa do endpoint:", `${VITE_TOOLFRONT_API_URL}/ask`);
    
    try {
      const response = await fetch(`${VITE_TOOLFRONT_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: inputValue }),
      });

      const data = await response.json();
      let raw = data?.resposta || "";
      let aiMessage: ChatMessage;

      if (raw.startsWith("hasTable")) {
        const lines: string[] = raw.split("\n").map(line => line.trim());
        const textoLine = lines.find(line => line.startsWith("texto:")) || "";
        const colunasLine = lines.find(line => line.startsWith("colunas:")) || "";
        const linhasLine = lines.find(line => line.startsWith("linhas:")) || "";

        const texto = textoLine.replace("texto:", "").trim();
        const colunas = colunasLine
          .replace("colunas:", "")
          .split(",")
          .map(c => c.trim())
          .filter(Boolean);

        const dados: string[][] = [];
        const regex = /\[([^\]]+)\]/g;
        let match;
        while ((match = regex.exec(linhasLine)) !== null) {
          const linha = match[1]
            .split(",")
            .map(c => c.trim())
            .filter(Boolean);
          dados.push(linha);
        }

        aiMessage = { role: "assistant", content: texto, tabela: { colunas, dados } };
      } else {
        aiMessage = { role: "assistant", content: raw };
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Ocorreu um erro ao tentar se comunicar com a IA.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen h-full container mx-auto p-6 space-y-8">
      <div className="flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="space-y-1 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chat com IA</h1>
            <p className="text-md text-gray-600 flex items-center gap-4">
              Tire suas dúvidas com o agente IA
              <DBStatusIndicator /> {/* <- componente importado */}
            </p>
          </div>
        </div>

        {/* Área do chat */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            ref={scrollRef}
            className="h-[500px] border rounded-md p-4 bg-white overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
                  } max-w-[70%]`}
                >
                  <div>{msg.content}</div>
                  {msg.tabela && <TableMessage tabela={msg.tabela} />}
                </div>
              ))}
              {loading && (
                <div className="p-2 rounded-md bg-gray-100 self-start max-w-[70%] flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Processando...
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Campo de input */}
        <motion.div
          className="flex gap-2 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua pergunta..."
            className="flex-1 h-10 bg-white my-3"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading} className="h-10 my-3">
            Enviar
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

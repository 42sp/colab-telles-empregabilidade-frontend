import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { Message } from "@/components/chat/types";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputValue }),
      });
      const data = await response.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data?.response || "Não foi possível processar sua solicitação.",
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
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
        {/* Cabeçalho sem animação */}
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl font-bold">Chat com IA</h1>
          <p className="text-md text-gray-600">
            Tire suas dúvidas com o agente IA
          </p>
        </div>

        {/* ScrollArea com animação */}
        <motion.div
          className="flex-1 h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollArea
            className="flex-1 border rounded-md p-4 bg-white h-full"
            ref={scrollRef}
          >
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    msg.role === "user"
                      ? "bg-blue-100 self-end"
                      : "bg-gray-100 self-start"
                  } max-w-[70%]`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="p-2 rounded-md bg-gray-100 self-start max-w-[70%] flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Processando...
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Campo de input com animação */}
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

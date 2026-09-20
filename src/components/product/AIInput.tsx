import React, { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface AIInputProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export const AIInput: React.FC<AIInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Sensei for activities near you (e.g. 'Weekend football in Kompally')..."
          className="w-full bg-white border-3 border-black text-black font-bold px-4 py-3 text-sm placeholder:text-black/50 brutal-shadow focus:outline-none focus:ring-2 focus:ring-neo-yellow"
        />
        <Sparkles className="absolute right-3 top-3.5 w-5 h-5 text-neo-pink pointer-events-none" />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        leftIcon={<Send className="w-4 h-4" />}
      >
        SEND
      </Button>
    </form>
  );
};

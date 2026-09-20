import React from "react";
import { AIMessage as AIMessageType } from "@/types";
import { ActivityCard } from "./ActivityCard";
import { Bot, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIMessageProps {
  message: AIMessageType;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const isSensei = message.sender === "sensei";

  return (
    <div
      className={cn(
        "flex gap-3 my-4 max-w-3xl",
        isSensei ? "items-start" : "items-start flex-row-reverse self-end ml-auto"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "w-10 h-10 border-3 border-black font-extrabold flex items-center justify-center shrink-0 brutal-shadow-sm select-none text-lg",
          isSensei ? "bg-neo-yellow text-black rotate-[-4deg]" : "bg-neo-pink text-white rotate-[4deg]"
        )}
      >
        {isSensei ? "🤖" : "⚡"}
      </div>

      {/* Bubble Container */}
      <div className="space-y-3 flex-1">
        <div
          className={cn(
            "border-3 border-black p-4 brutal-shadow font-semibold text-sm leading-relaxed relative",
            isSensei
              ? "bg-white text-black speech-bubble-bottom"
              : "bg-neo-yellow text-black font-bold"
          )}
        >
          {isSensei && (
            <span className="text-[10px] font-black uppercase text-neo-purple block mb-1 tracking-wider">
              ⚡ MELT SENSEI AI MATCHMAKER
            </span>
          )}
          <p className="whitespace-pre-line">{message.text}</p>
        </div>

        {/* Suggested Activity Cards Grid if present */}
        {message.suggestedActivities && message.suggestedActivities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {message.suggestedActivities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

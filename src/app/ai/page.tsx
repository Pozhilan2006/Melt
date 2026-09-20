"use client";

import React, { useState } from "react";
import { AIMessage } from "@/components/product/AIMessage";
import { AIInput } from "@/components/product/AIInput";
import { Tag } from "@/components/ui/Tag";
import { MOCK_AI_CONVERSATION, MOCK_ACTIVITIES, MOCK_COMMUNITIES } from "@/data/mockData";
import { AIMessage as AIMessageType } from "@/types";
import { Bot, Sparkles, Zap } from "lucide-react";

export default function AIPage() {
  const [messages, setMessages] = useState<AIMessageType[]>(MOCK_AI_CONVERSATION);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Find football near me",
    "Find people who play badminton",
    "What communities are active?",
    "I want something this weekend",
  ];

  const handleSend = (userText: string) => {
    const userMsg: AIMessageType = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate AI Sensei response matching user query
    setTimeout(() => {
      let matchedActivities = [MOCK_ACTIVITIES[0]];
      let responseText = `SUGOI! ⚡ Based on your request "${userText}", here are top rated matches near you in Hyderabad:`;

      const lower = userText.toLowerCase();

      if (lower.includes("badminton")) {
        matchedActivities = [MOCK_ACTIVITIES[1]];
        responseText = "SMASH ALERT! 🏸 I found an active indoor badminton doubles game in Gachibowli with 3 spots left!";
      } else if (lower.includes("communities") || lower.includes("active")) {
        matchedActivities = [MOCK_ACTIVITIES[0], MOCK_ACTIVITIES[2]];
        responseText = "TRIBE ALERT! ⛩️ 'Football Players — Kompally' and 'Hyderabad Developers' are the most active tribes near you!";
      } else if (lower.includes("weekend")) {
        matchedActivities = [MOCK_ACTIVITIES[0], MOCK_ACTIVITIES[1], MOCK_ACTIVITIES[3]];
        responseText = "WEEKEND VIBES! 🎉 Here are 3 high-hype activities happening this Saturday & Sunday!";
      }

      const senseiMsg: AIMessageType = {
        id: `sensei-${Date.now()}`,
        sender: "sensei",
        text: responseText,
        timestamp: "Just now",
        sticker: "🔥⚡",
        suggestedActivities: matchedActivities,
      };

      setMessages((prev) => [...prev, senseiMsg]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Anime Banner Header */}
      <div className="bg-neo-yellow border-4 border-black p-6 brutal-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 bg-black text-neo-yellow px-2.5 py-0.5 text-xs font-black uppercase">
            <Bot className="w-4 h-4 text-neo-pink" />
            <span>MELT SENSEI AI V2.0</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            NATURAL-LANGUAGE DISCOVERY ASSISTANT
          </h1>
          <p className="text-xs font-bold text-black/80 max-w-lg">
            Ask Sensei anything in plain English to find open activities, active tribes, or weekend squad partners.
          </p>
        </div>

        <div className="bg-white border-3 border-black p-3 brutal-shadow shrink-0 text-center font-black">
          <span className="text-3xl block">🤖⚡</span>
          <span className="text-[10px] uppercase bg-neo-pink text-white px-1">SENSEI LVL 99</span>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase text-black/70 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-neo-pink" /> SUGGESTED PROMPTS:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Tag
              key={prompt}
              label={prompt}
              onClick={() => handleSend(prompt)}
              variant="yellow"
            />
          ))}
        </div>
      </div>

      {/* Chat Conversation Thread */}
      <div className="bg-slate-50 border-4 border-black p-6 brutal-shadow-xl min-h-[420px] flex flex-col justify-between space-y-6">
        <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg) => (
            <AIMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border-2 border-black w-52 brutal-shadow-sm font-black text-xs uppercase animate-pulse">
              <span>🤖 SENSEI MATCHING SQUAD...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t-3 border-black bg-white -mx-6 -mb-6 p-4">
          <AIInput onSendMessage={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

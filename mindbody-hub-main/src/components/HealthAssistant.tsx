import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Sparkles, AlertTriangle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const HealthAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your friendly health information assistant. I'm here to help answer your general health and wellness questions. Remember, I provide general guidance only - always consult with healthcare professionals for specific medical advice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC122G3uWGBZwugIhVxLeiUoWaUFe82G8s";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  const systemPrompt = `You are a friendly and reliable health information assistant for a wellness website. Your role is to answer common health-related questions in a clear, accurate, and empathetic manner. 

Guidelines:
- Provide general guidance, wellness tips, and basic medical information
- Always include a disclaimer that responses are not a substitute for professional medical advice
- If the query is beyond general knowledge (specific diagnosis, prescriptions, emergencies), politely advise consulting a qualified healthcare professional
- Use concise and easy-to-understand language
- Be encouraging and supportive while maintaining accuracy
- Focus on wellness, prevention, and general health education
- Keep responses conversational but informative

Remember: You are not a doctor and cannot provide medical diagnosis or treatment recommendations.`;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser question: ${input}\n\nPlease provide a helpful response with appropriate disclaimers.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini API");
      }

      const data = await response.json();
      const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I apologize, but I'm having trouble processing your request right now. Please try again later.";

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or consider consulting with a healthcare professional for immediate concerns.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I improve my sleep?",
    "What are some stress management techniques?",
    "Tips for maintaining a healthy diet",
    "Benefits of regular exercise",
    "How to stay hydrated throughout the day",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-wellness-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-wellness-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Health Assistant</CardTitle>
            <CardDescription>
              Get wellness tips and health guidance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-wellness-primary/10"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="p-2 bg-wellness-primary/10 rounded-lg">
                    <Sparkles className="h-4 w-4 text-wellness-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-wellness-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="p-2 bg-wellness-primary/10 rounded-lg">
                    <MessageCircle className="h-4 w-4 text-wellness-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 bg-wellness-primary/10 rounded-lg">
                  <Sparkles className="h-4 w-4 text-wellness-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            placeholder="Ask me about health and wellness..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              <span>For medical advice, consult a healthcare professional</span>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAssistant;

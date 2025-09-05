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

  const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;
  // Note: Grok API endpoints are not yet publicly documented
  // This is a placeholder implementation that will need to be updated when official endpoints are available
  const GROK_API_URL = "https://api.x.ai/v1/chat/completions"; // Placeholder endpoint

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

  // Fallback responses for when Grok API is not available
  const getFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sleep') || input.includes('insomnia')) {
      return `Getting good sleep is crucial for your health! Here are some tips:

• Maintain a consistent sleep schedule
• Create a relaxing bedtime routine
• Keep your bedroom cool, dark, and quiet
• Avoid screens 1 hour before bed
• Limit caffeine after 2 PM
• Exercise regularly but not too close to bedtime

*Remember: These are general wellness tips. If you're experiencing persistent sleep issues, please consult with a healthcare professional.*`;
    }
    
    if (input.includes('stress') || input.includes('anxiety')) {
      return `Managing stress is important for your overall well-being. Try these techniques:

• Deep breathing exercises (4-7-8 technique)
• Regular physical activity
• Mindfulness meditation
• Progressive muscle relaxation
• Spending time in nature
• Maintaining social connections
• Getting adequate sleep

*Note: If stress is significantly impacting your daily life, consider speaking with a mental health professional.*`;
    }
    
    if (input.includes('diet') || input.includes('nutrition') || input.includes('food')) {
      return `A balanced diet is key to good health! Here are some general guidelines:

• Eat a variety of fruits and vegetables
• Choose whole grains over refined grains
• Include lean proteins (fish, poultry, beans)
• Limit processed foods and added sugars
• Stay hydrated with water
• Practice portion control
• Don't skip meals

*Please consult with a registered dietitian for personalized nutrition advice.*`;
    }
    
    if (input.includes('exercise') || input.includes('workout') || input.includes('fitness')) {
      return `Regular exercise has numerous health benefits! Consider these tips:

• Aim for at least 150 minutes of moderate activity per week
• Include both cardio and strength training
• Start slowly if you're new to exercise
• Find activities you enjoy
• Listen to your body and rest when needed
• Stay hydrated during workouts
• Warm up and cool down properly

*Always consult with a healthcare provider before starting a new exercise program, especially if you have health concerns.*`;
    }
    
    if (input.includes('water') || input.includes('hydrat')) {
      return `Staying hydrated is essential for your health! Here's what you should know:

• Aim for 8-10 glasses of water daily (varies by individual needs)
• Drink water throughout the day, not just when thirsty
• Include water-rich foods like fruits and vegetables
• Monitor your urine color (pale yellow is ideal)
• Increase intake during exercise or hot weather
• Limit sugary drinks and excessive caffeine

*Individual hydration needs vary based on activity level, climate, and health conditions.*`;
    }
    
    // Default response
    return `Thank you for your health question! I'm here to provide general wellness information and guidance.

While I can offer general health tips and information, please remember that:
• This is not a substitute for professional medical advice
• Always consult with healthcare professionals for specific concerns
• Seek immediate medical attention for urgent health issues
• Individual health needs vary greatly

Is there a specific aspect of health and wellness you'd like to learn more about?`;
  };

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
      // Check if Grok API key is available
      if (!GROK_API_KEY) {
        // Use fallback responses if no API key is provided
        console.warn("Grok API key not provided, using fallback responses");
        const assistantResponse = getFallbackResponse(input);
        const assistantMessage: Message = {
          role: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      // Try Grok API first (when available)
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-beta", // Placeholder model name
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `${input}\n\nPlease provide a helpful response with appropriate disclaimers.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        // Fallback to mock responses if Grok API is not available
        console.warn("Grok API not available, using fallback responses");
        const assistantResponse = getFallbackResponse(input);
        const assistantMessage: Message = {
          role: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      const data = await response.json();
      const assistantResponse = data.choices?.[0]?.message?.content || 
        "I apologize, but I'm having trouble processing your request right now. Please try again later.";

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Grok API:", error);
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

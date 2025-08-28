import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Heart, 
  BookOpen, 
  Sun, 
  Moon, 
  Download, 
  MessageCircle,
  Sparkles,
  Flower2,
  Calendar
} from "lucide-react";

interface MoodEntry {
  mood: string;
  date: string;
}

interface JournalEntry {
  journal: string;
  date: string;
}

interface TipEntry {
  tip: string;
  date: string;
}

const tips = [
  "Take a 10-minute walk in nature 🌿",
  "Drink a glass of water and take a deep breath 💧",
  "Write down three things you're grateful for 🙏",
  "Stretch your body and relax your muscles 🧘‍♀️",
  "Listen to your favorite song and dance it out 🎶",
  "Take a break from screens for 30 minutes 📵",
  "Read a chapter from a book you love 📚",
  "Treat yourself with kindness today 💖",
  "Say no to something that drains your energy ❌",
  "Light a candle and enjoy a few minutes of silence 🕯️"
];

const messages = [
  "You are stronger than you think 💪",
  "Your presence matters 💖",
  "Rest is productive too 🛌",
  "You are enough, exactly as you are 🌼",
  "Take up space. Your voice matters 🎤",
  "Keep blooming in your own way 🌷",
  "Small steps still move you forward 🚶‍♀️",
  "You deserve peace and happiness 🕊️",
  "Celebrate yourself today — you're doing great 🎉",
  "You don't have to do it all. Breathe 💫"
];

const affirmations = [
  "I am becoming the woman I've always wanted to be 🌼",
  "I carry strength, beauty, and purpose within me every day ✨",
  "I trust my journey — even when I don't have all the answers 🛤️",
  "I am a radiant source of light and calm 💡",
  "I wake up each day with courage in my heart and clarity in my soul 🌅",
  "I speak to myself with love and compassion today 💬💕",
  "I am not behind in life. I am right on time ⏰",
  "I am proud of my quiet victories and unseen growth 🌿",
  "Every breath I take is a step toward healing 🕊️",
  "I honor my needs without guilt or apology 🌸"
];

const SheShines = () => {
  const [currentTip, setCurrentTip] = useState<string>("");
  const [savedMoods, setSavedMoods] = useState<MoodEntry[]>([]);
  const [savedJournals, setSavedJournals] = useState<JournalEntry[]>([]);
  const [savedTips, setSavedTips] = useState<TipEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      const moods = localStorage.getItem('sheShines_moods');
      const journals = localStorage.getItem('sheShines_journals');
      const tips = localStorage.getItem('sheShines_tips');
      const darkMode = localStorage.getItem('sheShines_darkMode');

      if (moods) setSavedMoods(JSON.parse(moods));
      if (journals) setSavedJournals(JSON.parse(journals));
      if (tips) setSavedTips(JSON.parse(tips));
      if (darkMode) setIsDarkMode(JSON.parse(darkMode));
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sheShines_moods', JSON.stringify(savedMoods));
  }, [savedMoods]);

  useEffect(() => {
    localStorage.setItem('sheShines_journals', JSON.stringify(savedJournals));
  }, [savedJournals]);

  useEffect(() => {
    localStorage.setItem('sheShines_tips', JSON.stringify(savedTips));
  }, [savedTips]);

  useEffect(() => {
    localStorage.setItem('sheShines_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const generateTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const tip = tips[randomIndex];
    setCurrentTip(tip);

    const newTip: TipEntry = {
      tip,
      date: new Date().toLocaleString()
    };

    setSavedTips(prev => [...prev, newTip]);
  };

  const saveMood = () => {
    if (selectedMood) {
      const newMood: MoodEntry = {
        mood: selectedMood,
        date: new Date().toLocaleString()
      };

      setSavedMoods(prev => [...prev, newMood]);
      setSelectedMood("");
    }
  };

  const saveJournal = () => {
    if (journalEntry.trim()) {
      const newJournal: JournalEntry = {
        journal: journalEntry.trim(),
        date: new Date().toLocaleString()
      };

      setSavedJournals(prev => [...prev, newJournal]);
      setJournalEntry("");
    }
  };

  const showMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setModalContent(messages[randomIndex]);
    setModalTitle("A Message for You 💌");
    setShowModal(true);
  };

  const showAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setModalContent(affirmations[randomIndex]);
    setModalTitle("Your Daily Affirmation 💫");
    setShowModal(true);
  };

  const generatePDF = async () => {
    if (savedMoods.length === 0 && savedJournals.length === 0 && savedTips.length === 0) {
      alert("No saved entries to generate PDF.");
      return;
    }

    // Create a simple text file for now
    let content = "SheShines - Your Self Care Log\n\n";
    
    if (savedMoods.length > 0) {
      content += "Saved Moods:\n";
      savedMoods.forEach((entry, i) => {
        content += `${i + 1}. [${entry.date}] Mood: ${entry.mood}\n`;
      });
      content += "\n";
    }

    if (savedTips.length > 0) {
      content += "Generated Tips:\n";
      savedTips.forEach((entry, i) => {
        content += `${i + 1}. [${entry.date}] Tip: ${entry.tip}\n`;
      });
      content += "\n";
    }

    if (savedJournals.length > 0) {
      content += "Journal Entries:\n";
      savedJournals.forEach((entry, i) => {
        content += `${i + 1}. [${entry.date}]\n${entry.journal}\n\n`;
      });
    }

    // Create and download a text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SheShines_SelfCareLog_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-background'}`}>
      {/* Header */}
      <div className={`text-center py-8 ${isDarkMode ? 'bg-gray-800' : 'bg-wellness-primary/10'}`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Flower2 className="h-8 w-8 text-wellness-primary" />
          <h1 className="text-3xl font-bold text-wellness-primary">SheShines ✨</h1>
        </div>
        <p className="text-muted-foreground italic">
          For every mood, moment, and miracle in you.
        </p>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Purpose Section */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-wellness-primary" />
              The Purpose 🌸
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <strong>SheShines</strong> is a self-care space designed especially for women to reflect, recharge, and track emotions.
              Every woman deserves love, motivation and time to understand herself better both emotionally and mentally.
            </p>
          </CardContent>
        </Card>

        {/* Daily Self-Care Tip */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-wellness-accent" />
              Your Daily Dose of Self-Care 💖
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-wellness-accent/10 rounded-lg border-l-4 border-wellness-accent">
              {currentTip || "Your self-care task will appear here!"}
            </div>
            <Button onClick={generateTip} className="bg-wellness-accent hover:bg-wellness-accent/90">
              <Sparkles className="h-4 w-4 mr-2" />
              My Self-Care Task
            </Button>
          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              😊 Mood Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">How are you feeling today?</label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Mood --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="😊 Happy">😊 Happy</SelectItem>
                    <SelectItem value="😐 Okay">😐 Okay</SelectItem>
                    <SelectItem value="😟 Stressed">😟 Stressed</SelectItem>
                    <SelectItem value="😢 Sad">😢 Sad</SelectItem>
                    <SelectItem value="💪 Motivated">💪 Motivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveMood} disabled={!selectedMood} className="bg-wellness-primary hover:bg-wellness-primary/90">
                Save Mood
              </Button>
              
              {savedMoods.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Moods:</h4>
                  <div className="space-y-2">
                    {savedMoods.slice(-3).reverse().map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">{entry.mood}</Badge>
                        <span className="text-muted-foreground">{entry.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journal */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-wellness-secondary" />
              📝 Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Write your thoughts or reflections:</label>
                <Textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Today I felt..."
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={saveJournal} disabled={!journalEntry.trim()} className="bg-wellness-secondary hover:bg-wellness-secondary/90">
                Save Journal Entry
              </Button>
              
              {savedJournals.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Entries:</h4>
                  <div className="space-y-3">
                    {savedJournals.slice(-2).reverse().map((entry, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm mb-1">{entry.journal}</p>
                        <span className="text-xs text-muted-foreground">{entry.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Button onClick={showMessage} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Message for You 💌</span>
          </Button>
          
          <Button onClick={showAffirmation} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>Daily Affirmation 💫</span>
          </Button>
          
          <Button onClick={generatePDF} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Download className="h-5 w-5" />
            <span>Generate PDF</span>
          </Button>
          
          <Button onClick={toggleDarkMode} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </Button>
        </div>

        {/* Stats Summary */}
        {(savedMoods.length > 0 || savedJournals.length > 0 || savedTips.length > 0) && (
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-wellness-primary" />
                Your Self-Care Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-wellness-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-wellness-primary">{savedMoods.length}</div>
                  <div className="text-sm text-muted-foreground">Moods Tracked</div>
                </div>
                <div className="text-center p-4 bg-wellness-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-wellness-accent">{savedJournals.length}</div>
                  <div className="text-sm text-muted-foreground">Journal Entries</div>
                </div>
                <div className="text-center p-4 bg-wellness-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-wellness-secondary">{savedTips.length}</div>
                  <div className="text-sm text-muted-foreground">Self-Care Tips</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Message/Affirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-wellness-primary" />
              {modalTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg text-center leading-relaxed">{modalContent}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SheShines;

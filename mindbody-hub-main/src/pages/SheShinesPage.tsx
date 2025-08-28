import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Sun, Moon, Download, MessageCircle, Sparkles, Flower2 } from "lucide-react";

const tips = [
  "Take a 10-minute walk in nature 🌿",
  "Drink a glass of water and take a deep breath 💧",
  "Write down three things you're grateful for 🙏",
  "Stretch your body and relax your muscles 🧘‍♀️",
  "Listen to your favorite song and dance it out 🎶"
];

const messages = [
  "You are stronger than you think 💪",
  "Your presence matters 💖",
  "Rest is productive too 🛌",
  "You are enough, exactly as you are 🌼",
  "Take up space. Your voice matters 🎤"
];

const affirmations = [
  "I am becoming the woman I've always wanted to be 🌼",
  "I carry strength, beauty, and purpose within me every day ✨",
  "I trust my journey — even when I don't have all the answers 🛤️",
  "I am a radiant source of light and calm 💡",
  "I wake up each day with courage in my heart and clarity in my soul 🌅"
];

const SheShinesPage = () => {
  const [currentTip, setCurrentTip] = useState("");
  const [savedMoods, setSavedMoods] = useState<Array<{mood: string, date: string}>>([]);
  const [savedJournals, setSavedJournals] = useState<Array<{journal: string, date: string}>>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const moods = localStorage.getItem('sheShines_moods');
    const journals = localStorage.getItem('sheShines_journals');
    if (moods) setSavedMoods(JSON.parse(moods));
    if (journals) setSavedJournals(JSON.parse(journals));
  }, []);

  const generateTip = () => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  };

  const saveMood = () => {
    if (selectedMood) {
      const newMood = { mood: selectedMood, date: new Date().toLocaleString() };
      const updatedMoods = [...savedMoods, newMood];
      setSavedMoods(updatedMoods);
      localStorage.setItem('sheShines_moods', JSON.stringify(updatedMoods));
      setSelectedMood("");
    }
  };

  const saveJournal = () => {
    if (journalEntry.trim()) {
      const newJournal = { journal: journalEntry.trim(), date: new Date().toLocaleString() };
      const updatedJournals = [...savedJournals, newJournal];
      setSavedJournals(updatedJournals);
      localStorage.setItem('sheShines_journals', JSON.stringify(updatedJournals));
      setJournalEntry("");
    }
  };

  const showMessage = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);
  };

  const showAffirmation = () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    alert(randomAffirmation);
  };

  const generatePDF = () => {
    let content = "SheShines - Your Self Care Log\n\n";
    
    if (savedMoods.length > 0) {
      content += "Saved Moods:\n";
      savedMoods.forEach((entry, i) => {
        content += `${i + 1}. [${entry.date}] Mood: ${entry.mood}\n`;
      });
      content += "\n";
    }

    if (savedJournals.length > 0) {
      content += "Journal Entries:\n";
      savedJournals.forEach((entry, i) => {
        content += `${i + 1}. [${entry.date}]\n${entry.journal}\n\n`;
      });
    }

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flower2 className="h-8 w-8 text-wellness-primary" />
            <h1 className="text-3xl font-bold text-wellness-primary">SheShines ✨</h1>
          </div>
          <p className="text-muted-foreground italic">
            For every mood, moment, and miracle in you.
          </p>
        </div>
        {/* Purpose Section */}
        <Card className="mb-6">
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
        <Card className="mb-6">
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>😊 Mood Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">How are you feeling today?</label>
                <select 
                  value={selectedMood} 
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-- Select Mood --</option>
                  <option value="😊 Happy">😊 Happy</option>
                  <option value="😐 Okay">😐 Okay</option>
                  <option value="😟 Stressed">😟 Stressed</option>
                  <option value="😢 Sad">😢 Sad</option>
                  <option value="💪 Motivated">💪 Motivated</option>
                </select>
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
        <Card className="mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          
          <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SheShinesPage;

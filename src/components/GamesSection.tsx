import { Gamepad2, Users, Trophy, Star, Timer, Play, Brain, Heart, Leaf, Moon, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GamesSection = () => {
  const twoPlayerGames = [
    { 
      name: "Tic Tac Toe", 
      players: "2", 
      difficulty: "Easy", 
      time: "5 min", 
      coins: 10,
      url: "https://playtictactoe.org/",
      description: "Classic 3x3 grid game"
    },
    { 
      name: "Chess", 
      players: "2", 
      difficulty: "Hard", 
      time: "30 min", 
      coins: 50,
      url: "https://www.chess.com/play/computer",
      description: "Strategic board game"
    },
    { 
      name: "Checkers", 
      players: "2", 
      difficulty: "Medium", 
      time: "20 min", 
      coins: 30,
      url: "https://www.247checkers.com/",
      description: "Classic checkers game"
    },
    { 
      name: "Connect 4", 
      players: "2", 
      difficulty: "Easy", 
      time: "10 min", 
      coins: 15,
      url: "https://www.mathsisfun.com/games/connect4.html",
      description: "Drop discs to connect four"
    },
    { 
      name: "Battleship", 
      players: "2", 
      difficulty: "Medium", 
      time: "15 min", 
      coins: 25,
      url: "https://www.battleshiponline.org/",
      description: "Naval warfare strategy"
    },
    { 
      name: "Word Duel", 
      players: "2", 
      difficulty: "Medium", 
      time: "12 min", 
      coins: 20,
      url: "https://wordleunlimited.org/",
      description: "Word guessing game"
    },
    { 
      name: "Sudoku", 
      players: "1-2", 
      difficulty: "Hard", 
      time: "25 min", 
      coins: 40,
      url: "https://sudoku.com/",
      description: "Number puzzle game"
    },
    { 
      name: "Memory Match", 
      players: "1-2", 
      difficulty: "Easy", 
      time: "8 min", 
      coins: 12,
      url: "https://www.memozor.com/memory-games/for-kids",
      description: "Card matching game"
    },
    { 
      name: "Trivia Challenge", 
      players: "1-4", 
      difficulty: "Medium", 
      time: "18 min", 
      coins: 35,
      url: "https://www.sporcle.com/",
      description: "Knowledge quiz game"
    },
    { 
      name: "2048", 
      players: "1", 
      difficulty: "Easy", 
      time: "15 min", 
      coins: 18,
      url: "https://2048game.com/",
      description: "Number sliding puzzle"
    },
    { 
      name: "Snake Game", 
      players: "1", 
      difficulty: "Easy", 
      time: "10 min", 
      coins: 15,
      url: "https://snake.io/",
      description: "Classic snake game"
    },
    { 
      name: "Tetris", 
      players: "1", 
      difficulty: "Medium", 
      time: "20 min", 
      coins: 30,
      url: "https://tetris.com/play-tetris",
      description: "Block stacking puzzle"
    }
  ];

  const communityGames = [
    { 
      name: "Ludo", 
      players: "2-4", 
      difficulty: "Easy", 
      time: "20 min", 
      coins: 25, 
      online: 12,
      url: "https://www.ludoking.com/",
      description: "Classic board game"
    },
    { 
      name: "Pool", 
      players: "2-8", 
      difficulty: "Medium", 
      time: "15 min", 
      coins: 30, 
      online: 8,
      url: "https://www.miniclip.com/games/8-ball-pool-multiplayer/en/",
      description: "8-ball pool multiplayer"
    },
    { 
      name: "Mafia", 
      players: "6-12", 
      difficulty: "Medium", 
      time: "30 min", 
      coins: 40, 
      online: 15,
      url: "https://www.mafia.gg/",
      description: "Social deduction game"
    },
    { 
      name: "Among Us", 
      players: "4-10", 
      difficulty: "Easy", 
      time: "25 min", 
      coins: 35, 
      online: 22,
      url: "https://www.innersloth.com/games/among-us/",
      description: "Space survival game"
    },
    { 
      name: "Skribbl.io", 
      players: "2-12", 
      difficulty: "Easy", 
      time: "15 min", 
      coins: 25, 
      online: 18,
      url: "https://skribbl.io/",
      description: "Drawing and guessing game"
    },
    { 
      name: "Gartic Phone", 
      players: "3-16", 
      difficulty: "Easy", 
      time: "20 min", 
      coins: 30, 
      online: 25,
      url: "https://garticphone.com/",
      description: "Telephone game with drawing"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-wellness-success";
      case "Medium": return "bg-wellness-accent";
      case "Hard": return "bg-wellness-warning";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-wellness-primary" />
            Games Zone
          </CardTitle>
          <p className="text-muted-foreground">Take a break and boost your wellness points!</p>
        </CardHeader>
      </Card>

      {/* Two Player Games */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-wellness-primary" />
            Two Player Games
          </CardTitle>
          <p className="text-sm text-muted-foreground">Challenge your colleagues to quick games</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {twoPlayerGames.map((game, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm">{game.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {game.players}P
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge 
                          className={`${getDifficultyColor(game.difficulty)} text-white text-xs`}
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          Time:
                        </span>
                        <span>{game.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Coins:
                        </span>
                        <span className="font-medium text-wellness-accent">{game.coins}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(game.url, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Games */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-wellness-primary" />
            Community Games
          </CardTitle>
          <p className="text-sm text-muted-foreground">Join multiplayer games with your team</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityGames.map((game, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{game.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-wellness-success">
                        <div className="w-2 h-2 bg-wellness-success rounded-full animate-pulse"></div>
                        {game.online} online
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Players:</span>
                        <div className="font-medium">{game.players}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <div className="font-medium">{game.time}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge 
                          className={`${getDifficultyColor(game.difficulty)} text-white text-xs`}
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Coins:</span>
                        <div className="font-medium text-wellness-accent">{game.coins}</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(game.url, '_blank')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness & Meditation Games */}
      <Card className="wellness-card bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Mindfulness & Meditation Games
          </CardTitle>
          <p className="text-sm text-muted-foreground">Relax, focus, and find your inner peace through mindful gaming</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                name: "Headspace", 
                players: "1", 
                difficulty: "Easy", 
                time: "10 min", 
                coins: 25,
                url: "https://www.headspace.com/",
                description: "Guided meditation and mindfulness",
                icon: <Moon className="w-4 h-4 text-purple-500" />,
                category: "Meditation"
              },
              { 
                name: "Calm", 
                players: "1", 
                difficulty: "Easy", 
                time: "15 min", 
                coins: 30,
                url: "https://www.calm.com/",
                description: "Sleep stories and meditation",
                icon: <Leaf className="w-4 h-4 text-green-500" />,
                category: "Sleep"
              },
              { 
                name: "Insight Timer", 
                players: "1", 
                difficulty: "Easy", 
                time: "5-60 min", 
                coins: 20,
                url: "https://insighttimer.com/",
                description: "Free meditation app with timer",
                icon: <Sun className="w-4 h-4 text-yellow-500" />,
                category: "Meditation"
              },
              { 
                name: "Breathwrk", 
                players: "1", 
                difficulty: "Easy", 
                time: "5 min", 
                coins: 15,
                url: "https://www.breathwrk.com/",
                description: "Breathing exercises and techniques",
                icon: <Wind className="w-4 h-4 text-blue-500" />,
                category: "Breathing"
              },
              { 
                name: "Ten Percent Happier", 
                players: "1", 
                difficulty: "Medium", 
                time: "20 min", 
                coins: 35,
                url: "https://www.tenpercent.com/",
                description: "Practical meditation for skeptics",
                icon: <Heart className="w-4 h-4 text-pink-500" />,
                category: "Wellness"
              },
              { 
                name: "Waking Up", 
                players: "1", 
                difficulty: "Medium", 
                time: "25 min", 
                coins: 40,
                url: "https://wakingup.com/",
                description: "Consciousness and mindfulness",
                icon: <Brain className="w-4 h-4 text-indigo-500" />,
                category: "Philosophy"
              },
              { 
                name: "Smiling Mind", 
                players: "1", 
                difficulty: "Easy", 
                time: "10 min", 
                coins: 20,
                url: "https://www.smilingmind.com.au/",
                description: "Mindfulness for all ages",
                icon: <Sun className="w-4 h-4 text-orange-500" />,
                category: "Family"
              },
              { 
                name: "Stop, Breathe & Think", 
                players: "1", 
                difficulty: "Easy", 
                time: "8 min", 
                coins: 18,
                url: "https://www.stopbreathethink.com/",
                description: "Emotional wellness check-ins",
                icon: <Heart className="w-4 h-4 text-red-500" />,
                category: "Emotions"
              },
              { 
                name: "MyLife Meditation", 
                players: "1", 
                difficulty: "Easy", 
                time: "12 min", 
                coins: 22,
                url: "https://mylife.com/",
                description: "Personalized meditation sessions",
                icon: <Leaf className="w-4 h-4 text-emerald-500" />,
                category: "Personalized"
              },
              { 
                name: "Simple Habit", 
                players: "1", 
                difficulty: "Easy", 
                time: "5 min", 
                coins: 15,
                url: "https://www.simplehabit.com/",
                description: "5-minute meditation sessions",
                icon: <Timer className="w-4 h-4 text-cyan-500" />,
                category: "Quick"
              },
              { 
                name: "Aura", 
                players: "1", 
                difficulty: "Easy", 
                time: "7 min", 
                coins: 18,
                url: "https://www.aurahealth.io/",
                description: "AI-powered meditation app",
                icon: <Brain className="w-4 h-4 text-violet-500" />,
                category: "AI"
              },
              { 
                name: "Balance", 
                players: "1", 
                difficulty: "Medium", 
                time: "15 min", 
                coins: 28,
                url: "https://www.balanceapp.com/",
                description: "Personalized meditation journey",
                icon: <Heart className="w-4 h-4 text-rose-500" />,
                category: "Journey"
              }
            ].map((game, index) => (
              <Card key={index} className="border hover:shadow-lg transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {game.icon}
                        <h3 className="font-semibold text-sm">{game.name}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs">
                          {game.players}P
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {game.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{game.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge 
                          className={`${getDifficultyColor(game.difficulty)} text-white text-xs`}
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          Time:
                        </span>
                        <span>{game.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Coins:
                        </span>
                        <span className="font-medium text-purple-600">{game.coins}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700"
                      onClick={() => window.open(game.url, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start Meditating
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fitness & Wellness Games */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-wellness-primary" />
            Fitness & Wellness Games
          </CardTitle>
          <p className="text-sm text-muted-foreground">Games that promote physical and mental wellness</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                name: "Just Dance Now", 
                players: "1-4", 
                difficulty: "Easy", 
                time: "15 min", 
                coins: 30,
                url: "https://justdancenow.com/",
                description: "Dance fitness game"
              },
              { 
                name: "Zombies, Run!", 
                players: "1", 
                difficulty: "Medium", 
                time: "30 min", 
                coins: 40,
                url: "https://zombiesrungame.com/",
                description: "Running adventure game"
              },
              { 
                name: "Pokemon GO", 
                players: "1-20", 
                difficulty: "Easy", 
                time: "20 min", 
                coins: 25,
                url: "https://pokemongolive.com/",
                description: "AR walking game"
              },
              { 
                name: "Lumosity", 
                players: "1", 
                difficulty: "Medium", 
                time: "15 min", 
                coins: 25,
                url: "https://www.lumosity.com/",
                description: "Brain training games"
              },
              { 
                name: "Peak", 
                players: "1", 
                difficulty: "Medium", 
                time: "12 min", 
                coins: 22,
                url: "https://www.peak.net/",
                description: "Cognitive training"
              },
              { 
                name: "Elevate", 
                players: "1", 
                difficulty: "Medium", 
                time: "10 min", 
                coins: 20,
                url: "https://www.elevateapp.com/",
                description: "Brain training and focus"
              }
            ].map((game, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm">{game.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {game.players}P
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{game.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge 
                          className={`${getDifficultyColor(game.difficulty)} text-white text-xs`}
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          Time:
                        </span>
                        <span>{game.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Coins:
                        </span>
                        <span className="font-medium text-wellness-accent">{game.coins}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(game.url, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-wellness-primary" />
          <div className="text-2xl font-bold text-wellness-primary">59</div>
          <p className="text-sm text-muted-foreground">Games Played</p>
        </Card>
        
        <Card className="stat-card">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-wellness-accent" />
          <div className="text-2xl font-bold text-wellness-primary">23</div>
          <p className="text-sm text-muted-foreground">Games Won</p>
        </Card>
        
        <Card className="stat-card">
          <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">12</div>
          <p className="text-sm text-muted-foreground">Meditation Sessions</p>
        </Card>
        
        <Card className="stat-card">
          <Star className="w-8 h-8 mx-auto mb-2 text-wellness-warning" />
          <div className="text-2xl font-bold text-wellness-primary">485</div>
          <p className="text-sm text-muted-foreground">Coins Earned</p>
        </Card>
      </div>
    </div>
  );
};

export default GamesSection;
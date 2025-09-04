import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, ExternalLink, Play, Pause, Volume2, Heart, RefreshCw } from 'lucide-react';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image: string;
  tracks: number;
  duration: string;
  category: string;
}

const SpotifyFreePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>('37i9dQZF1DXcBWIGoYBM5M');

  const playlists: SpotifyPlaylist[] = [
    {
      id: '37i9dQZF1DXcBWIGoYBM5M',
      name: "Today's Top Hits",
      description: 'The most played songs right now',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a751c602123b8d61f2372',
      tracks: 50,
      duration: '2h 30m',
      category: 'Popular'
    },
    {
      id: '37i9dQZF1DX4Wsb4d7NKfP',
      name: 'Peaceful Piano',
      description: 'Relax and unwind with gentle piano',
      image: 'https://i.scdn.co/image/ab67706f00000002a1a0b0b0b0b0b0b0b0b0b0b0',
      tracks: 30,
      duration: '1h 45m',
      category: 'Relaxation'
    },
    {
      id: '37i9dQZF1DX0XUsuxWHRQd',
      name: 'RapCaviar',
      description: 'New music from Drake, Kendrick Lamar and more',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a751c602123b8d61f2372',
      tracks: 50,
      duration: '2h 45m',
      category: 'Hip-Hop'
    },
    {
      id: '37i9dQZF1DX4dyzvuaRJ0n',
      name: 'mint',
      description: 'The freshest electronic music',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a751c602123b8d61f2372',
      tracks: 50,
      duration: '2h 15m',
      category: 'Electronic'
    },
    {
      id: '37i9dQZF1DX7Jl5KP2eZaS',
      name: 'Most Necessary',
      description: 'The biggest songs in hip-hop right now',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a751c602123b8d61f2372',
      tracks: 50,
      duration: '2h 30m',
      category: 'Hip-Hop'
    },
    {
      id: '37i9dQZF1DXcBWIGoYBM5M',
      name: 'Wellness Focus',
      description: 'Music for concentration and productivity',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a751c602123b8d61f2372',
      tracks: 25,
      duration: '1h 30m',
      category: 'Focus'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Popular': return 'bg-green-100 text-green-800';
      case 'Relaxation': return 'bg-blue-100 text-blue-800';
      case 'Hip-Hop': return 'bg-purple-100 text-purple-800';
      case 'Electronic': return 'bg-pink-100 text-pink-800';
      case 'Focus': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlaylistChange = (playlistId: string) => {
    setCurrentPlaylist(playlistId);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentPlaylistData = playlists.find(p => p.id === currentPlaylist);

  return (
    <div className="space-y-6">
      {/* Playlist Selector */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Music className="w-5 h-5 text-green-600" />
            Spotify Free Player
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enjoy music without signing in - powered by Spotify's free tier
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Card 
                key={playlist.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentPlaylist === playlist.id 
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handlePlaylistChange(playlist.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{playlist.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getCategoryColor(playlist.category)}`}>
                          {playlist.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {playlist.tracks} tracks
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spotify Player */}
      <Card className="wellness-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Music className="w-5 h-5 text-green-600" />
                {currentPlaylistData?.name || 'Select a Playlist'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentPlaylistData?.description || 'Choose a playlist to start playing'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={togglePlay}
                className="flex items-center gap-1"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(`https://open.spotify.com/playlist/${currentPlaylist}`, '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Spotify
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Spotify Embed */}
          <div className="space-y-4">
            <div className="bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://open.spotify.com/embed/playlist/${currentPlaylist}?utm_source=generator&theme=0&t=0&autoplay=${isPlaying ? '1' : '0'}`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full"
                title={`Spotify playlist: ${currentPlaylistData?.name}`}
              />
            </div>
            
            {/* Playlist Info */}
            {currentPlaylistData && (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentPlaylistData.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentPlaylistData.tracks} tracks • {currentPlaylistData.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card className="wellness-card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Music className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">No Login Required</h3>
              <p className="text-xs text-muted-foreground">
                Start playing immediately with Spotify's free tier
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">High Quality Audio</h3>
              <p className="text-xs text-muted-foreground">
                Enjoy crisp, clear sound from Spotify's servers
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Full Spotify Access</h3>
              <p className="text-xs text-muted-foreground">
                Open in Spotify app for full features and controls
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifyFreePlayer;

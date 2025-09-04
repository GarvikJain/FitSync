import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface SpotifyPlayerStandaloneProps {
  playlistId?: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  className?: string;
}

const SpotifyPlayerStandalone: React.FC<SpotifyPlayerStandaloneProps> = ({
  playlistId = '37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits as default
  width = '100%',
  height = '352',
  autoplay = false,
  className = ''
}) => {
  return (
    <Card className={`wellness-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-green-600" />
          Spotify Player
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enjoy music with Spotify's free tier - no login required
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&t=0&autoplay=${autoplay ? '1' : '0'}`}
            width={width}
            height={height}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full"
            title={`Spotify playlist: ${playlistId}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyPlayerStandalone;

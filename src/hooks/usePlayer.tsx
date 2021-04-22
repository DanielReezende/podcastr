import { createContext, ReactNode, useContext, useState } from 'react';

interface Episode {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

interface PlayerContextData {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  tooglePlay: () => void;
  setPlayingState: (state: boolean) => void;
}

interface PlayerProviderPros {
  children: ReactNode
}

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children }: PlayerProviderPros) {
  const [episodeList, setEpisodeList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider 
      value={{ episodeList, currentEpisodeIndex, isPlaying, play, tooglePlay, setPlayingState }}
    >
      { children }
    </PlayerContext.Provider>
  )
}


export function usePlayer() {
  const context = useContext(PlayerContext);

  return context;
}

 
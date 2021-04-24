import { createContext } from 'react';

type Epsode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string,
};

type PlayerContextData = {
    epsodeList: Epsode[];
    currentEpsodeIndex: number;
    isPlaying: boolean;
    play: (epsode:Epsode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;

};

export const PlayerContext = createContext({} as PlayerContextData);
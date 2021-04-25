import { createContext, ReactNode, useContext, useState } from 'react';

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
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (epsode:Epsode) => void;
    playList: (list: Epsode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    
};

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerConxtProvider({ children }: PlayerContextProviderProps) {
    const [epsodeList, setEpsodeList] = useState([]);
    const [currentEpsodeIndex, setCurrentEpsodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(epsode: Epsode) {
        setEpsodeList([epsode]);
        setCurrentEpsodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Epsode[], index: number) {
        setEpsodeList(list);
        setCurrentEpsodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasNext = isShuffling || (currentEpsodeIndex + 1) < epsodeList.length;
    const hasPrevious = currentEpsodeIndex > 0;

    function playNext() {

        if (isShuffling) {
            const nextRandomEpsodeIndex = Math.floor(Math.random() * epsodeList.length);
            setCurrentEpsodeIndex(nextRandomEpsodeIndex);
        } else if (hasNext) {
            setCurrentEpsodeIndex(currentEpsodeIndex + 1);    
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpsodeIndex(currentEpsodeIndex - 1);    
        }
    }

    function clearPlayerState() {
        setEpsodeList([]);
        setCurrentEpsodeIndex(0);
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                epsodeList, 
                currentEpsodeIndex, 
                play,
                playList,
                playNext,
                playPrevious,
                setPlayingState,
                clearPlayerState,
                isPlaying,
                isLooping,
                isShuffling,
                togglePlay, 
                toggleLoop,
                toggleShuffle,
                hasNext,
                hasPrevious,
                
            }}
        >
            { children }
        </PlayerContext.Provider>
    );
}

export const usePayer = () => {
    return useContext(PlayerContext);
}
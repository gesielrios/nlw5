import Image from 'next/image';
import Slider from 'rc-slider';
import { usePayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { 
        epsodeList, 
        currentEpsodeIndex, 
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState,
    } = usePayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpsodeEnded() {
        if (hasNext) {
            playNext();
        }
        else {
            clearPlayerState();
        }
    }

    const epsode = epsodeList[currentEpsodeIndex];
   
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { epsode ? (
                <div className={styles.currentEpsode}>
                    <Image 
                        width={592}
                        height={592}
                        src={epsode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{ epsode.title }</strong>
                    <span>{ epsode.members }</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}
            
            <footer className={!epsode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { epsode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth:4 }}
                                max={epsode.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>
                    <span>{convertDurationToTimeString(epsode?.duration ?? 0)}</span>
                </div>

                { epsode && (
                    <audio 
                        src={epsode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onPlay={() => {setPlayingState(true)}}
                        onPause={() => {setPlayingState(false)}}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpsodeEnded}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!epsode || epsodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}

                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button 
                        type="button" 
                        onClick={playPrevious} 
                        disabled={!epsode || !hasPrevious}
                    >
                        <img src="/play-previous.svg" alt="Tocar anteior" />
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!epsode}
                        onClick={togglePlay}
                    >
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pausar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        )}
                    </button>
                    <button 
                        type="button" 
                        onClick={playNext} 
                        disabled={!epsode || !hasNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button 
                        type="button" 
                        disabled={!epsode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
};
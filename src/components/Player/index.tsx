import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import 'rc-slider/assets/index.css';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        epsodeList, 
        currentEpsodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
    } = useContext(PlayerContext);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

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
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { epsode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth:4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>
                    <span>00:00</span>
                </div>

                { epsode && (
                    <audio 
                        src={epsode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => {setPlayingState(true)}}
                        onPause={() => {setPlayingState(false)}}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!epsode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!epsode}>
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
                    <button type="button" disabled={!epsode}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" disabled={!epsode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
};
import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [epsodeList, setEpsodeList] = useState([]);
  const [currentEpsodeIndex, setCurrentEpsodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(epsode) {
    setEpsodeList([epsode]);
    setCurrentEpsodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{ epsodeList, currentEpsodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
};

export default MyApp;

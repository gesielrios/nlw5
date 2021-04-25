import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerConxtProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {

  return (
    <PlayerConxtProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerConxtProvider>
  );
};

export default MyApp;

import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR  from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { usePayer } from '../contexts/PlayerContext';

type Epsode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  latestEpsodes: Epsode[];
  allEpsodes: Epsode[];
};

export default function Home({latestEpsodes, allEpsodes}: HomeProps) {

  const { playList } = usePayer();
  const epsodeList = [...latestEpsodes, ...allEpsodes];

  return (
    <div className={styles.homepage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpsodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpsodes.map((epsode, index) => {
            return (
              <li key={epsode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={epsode.thumbnail} 
                  alt={epsode.title} 
                  objectFit="cover"/>
                
                <div className={styles.epsodesDetails}>
                  <Link href={`/epsodes/${epsode.id}`}>
                    <a>{epsode.title}</a>
                  </Link>
                  
                  <p>{epsode.members}</p>
                  <span>{epsode.publishedAt}</span>
                  <span>{epsode.durationAsString}</span>
                </div>
                
                <button 
                  type="button" 
                  onClick={
                    () => {
                      playList(epsodeList, index);
                    }
                  }>
                  <img src="/play-green.svg" alt="tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpsodes}>
          <h2>Todos Episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpsodes.map((epsode, index) => {
                return (
                  <tr key={epsode.id}>
                    <td style={{ width:72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={epsode.thumbnail}
                        alt={epsode.title}
                        objectFit="cover" />
                    </td>
                    <td>
                      <Link href={`/epsodes/${epsode.id}`}>
                        <a>{epsode.title}</a>
                      </Link>
                    </td>
                    <td>{epsode.members}</td>
                    <td style={{ width:120 }}>{epsode.publishedAt}</td>
                    <td>{epsode.durationAsString}</td>
                    <td>
                      <button 
                        type="button" 
                        onClick={
                          () => playList(epsodeList, index + latestEpsodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div> 
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const epsodes = data.map(epsode => {
    return {
      id: epsode.id,
      title: epsode.title,
      thumbnail: epsode.thumbnail,
      members: epsode.members,
      publishedAt: format(parseISO(epsode.published_at), 'd MMM y', { locale: ptBR }),
      duration: Number(epsode.file.duration),
      durationAsString: convertDurationToTimeString(Number(epsode.file.duration)),
      url: epsode.file.url,
    }
  });

  const latestEpsodes = epsodes.slice(0, 2);
  const allEpsodes = epsodes.slice(2, epsodes.length);
  
  return {
    props: {
      latestEpsodes,
      allEpsodes,
    },
    revalidate: 60 * 60 * 8,
  };
};

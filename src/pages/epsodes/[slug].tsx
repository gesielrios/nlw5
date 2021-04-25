import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import style from './epsode.module.scss';
import { usePayer } from '../../contexts/PlayerContext';

type Epsode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
};

type EpsodeProps = {
    epsode: Epsode,
};

export default function Epsode({ epsode }:EpsodeProps) {

    const { play } = usePayer();

    return (
        <div className={style.epsodeContainer}>

            <Head>
                <title>{epsode.title} | Podcastr</title>
            </Head>

            <div className={style.epsode}>
                <div className={style.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>
                    <Image 
                        width={700} 
                        height={160} 
                        src={epsode.thumbnail} 
                        objectFit="cover" 
                    />
                    <button 
                        type="button"
                        onClick={() => {play(epsode)}}
                    >
                        <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>

                <header>
                    <h1>{epsode.title}</h1>
                    <span>{epsode.members}</span>
                    <span>{epsode.publishedAt}</span>
                    <span>{epsode.durationAsString}</span>
                </header>

                <div 
                    className={style.description} 
                    dangerouslySetInnerHTML={{ __html: epsode.description}}
                />
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get("episodes", {
        params: {
            _limit: 12,
            _sort: "published_at",
            _order: "desc",
        },
    });

    const paths = data.map((episode) => {
        return {
            params: {
                slug: episode.id,
            },
        };
    });

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const epsode = {  
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM y', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,    
    };

    return {
        props: {epsode},
        revalidate: 60 * 60 * 24,
    };
};
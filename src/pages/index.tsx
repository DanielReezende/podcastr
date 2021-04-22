import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { usePlayer } from '../hooks/usePlayer';


interface Episode {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = usePlayer();

  return (
  <>
    <Head>
      <title>Home | Podcastr</title>
    </Head>
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => (
              <li key={episode.id}>
                <Image
                  src={episode.thumbnail}
                  objectFit='cover'
                  alt={episode.title}
                  width={192}
                  height={192}
                />                
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

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
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 70 }}>
                  <Image 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  width={120} 
                  height={120} 
                  objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>{episode.members}</td>
                <td style={{ width: 90 }}>{episode.publishedAt}</td>
                <td style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => play(episode)}>
                    <img src="/play-green.svg" alt="Tocar episódio"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  </>
  )
}

export const getStaticProps: GetStaticProps = async ()  => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
import Head from 'next/head';
import Glitch from '@/components/Glitch';

export default function Home() {
  const images = [
    'images/img01.png',
    'images/img02.png',
    'images/img03.png',
    'images/img04.png',
  ];
  return (
    <>
      <Head>
        <title>threejs glitch for Next.js.</title>
      </Head>
      <Glitch images={images}/>
    </>
  );
}

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Artist.module.css'

const Artist = ({title, artist}) => {
  const router = useRouter();

  return (
    <>
      <div className={styles.artist}>
      <div className={styles.image}>
      <image src='image/inception.jpg' />
      </div>
      <div className={styles.content}>

        <h2>{title}</h2>
        <br></br>
        <h4>{artist}</h4>
      </div>
      </div>
    </>
  );
};

export default Artist;

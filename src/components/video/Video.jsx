import React, { useRef, useEffect } from 'react';

import styles from './video.module.css';

function Video(props) {
  const { stream } = props;
  const s = useRef();

  useEffect(() => {
    s.current.srcObject = stream;
  }, [props]);

  return (
    <div className={styles.main}>
      The video

      <video ref={s} playsInline autoPlay />
    </div>
  );
}

export default Video;

import React from 'react';
import styles from './Viewer.scss';
import classNames from 'classnames/bind';
import { CubeGrid } from 'better-react-spinkit';

const cx = classNames.bind(styles);

const Viewer = ({ mediaType, url, loading }) => {
  if (loading) {
    // 로딩중일때 로더 보여주기
    return (
      <div className={cx('viewer')}>
        <CubeGrid size={50} color="#3377FF" />
      </div>
    );
  }

  if (!url) return null;

  return (
    <div className={cx('viewer')}>
      {mediaType === 'image' ? (
        <img onClick={() => window.open(url)} src={url} alt="space" />
      ) : (
        <iframe
          title="space-video"
          src={url}
          frameBorder="0"
          gesture="media"
          allow="encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default Viewer;

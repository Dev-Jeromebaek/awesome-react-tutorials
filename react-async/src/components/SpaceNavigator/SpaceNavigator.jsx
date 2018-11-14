import React from 'react';
import styles from './SpaceNavigator.scss';
import classNames from 'classnames/bind';
import * as MD from 'react-icons/md';

const cx = classNames.bind(styles);

const SpaceNavigator = ({ onPrev, onNext }) => {
  return (
    <div className={cx('space-navigator')}>
      <div className={cx('left', 'end')}>
        <div className={cx('circle')} onClick={onPrev}>
          <MD.MdChevronLeft />
        </div>
      </div>
      <div className={cx('right', 'end')}>
        <div className={cx('circle')} onClick={onNext}>
          <MD.MdChevronRight />
        </div>
      </div>
    </div>
  );
};

export default SpaceNavigator;

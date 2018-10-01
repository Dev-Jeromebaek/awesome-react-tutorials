import React from 'react';
import PeoInfo from './PeoInfo';

const PeoList = ({ info, onRemove }) => {
  const list = info.map(peo => (
    <PeoInfo info={peo} onRemove={onRemove} key={peo.id} />
  ));
  return <div>{list}</div>;
};

export default PeoList;

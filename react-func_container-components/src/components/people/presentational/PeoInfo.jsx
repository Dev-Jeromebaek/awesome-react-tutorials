import React from 'react';

const PeoInfo = ({ info, onRemove }) => {
  const style = {
    border: '1px solid black',
    padding: '8px',
    margin: '10px auto',
    width: '50%'
  };
  const { name, age, id } = info;
  return (
    <div style={style}>
      <div>
        <b>{name}</b>
      </div>
      <div>
        <b>{age}</b>
      </div>
      <button onClick={() => onRemove(id)}>삭제</button>
    </div>
  );
};

export default PeoInfo;

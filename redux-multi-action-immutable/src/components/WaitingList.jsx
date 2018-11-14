import React from 'react';
import './WaitingList.css';

const WaitingItem = ({ text, entered, onEnter, onLeave }) => {
  return (
    <li>
      <div className={`text ${entered ? 'entered' : ''}`}>{text}</div>
      <div className="buttons">
        <button onClick={onEnter}>입장</button>
        <button onClick={onLeave}>나감</button>
      </div>
    </li>
  );
};

const WaitingList = ({
  input,
  waitingList,
  onChange,
  onSubmit,
  onEnter,
  onLeave,
}) => {
  // **** 데이터를 컴포넌트 리스트로 변환
  const waitingItems = waitingList.map(w => (
    <WaitingItem
      key={w.get('id')}
      text={w.get('name')}
      entered={w.get('entered')}
      id={w.get('id')}
      onEnter={() => onEnter(w.get('id'))}
      onLeave={() => onLeave(w.get('id'))}
    />
  ));
  console.log(waitingItems);
  return (
    <div className="WaitingList">
      <h2>대기자 명단</h2>
      {/* form 과 input 에 이벤트 및 값 설정 */}
      <form onSubmit={onSubmit}>
        <input value={input} onChange={onChange} />
        <button>등록</button>
      </form>
      <ul>{waitingItems}</ul> {/* 하드코딩된것을 컴포넌트 배열로 교체 */}
    </div>
  );
};

export default WaitingList;

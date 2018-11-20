import React, { Component } from 'react';
import { InputPlaceholder, WhiteBox } from 'components/WriteMemo';
import { InputSet, SaveButton } from 'components/Shared';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as uiActions from 'modules/ui';
import * as memoActions from 'modules/memo';
import enhanceWithClickOutside from 'react-click-outside';

class WriteMemo extends Component {
  handleFocus = () => {
    const { focused, UIActions } = this.props;

    // 포커스 된 상태가 아닐 때만 실행합니다.
    if (!focused) {
      UIActions.focusInput();
    }
  };

  handleClickOutside = () => {
    const { UIActions, focused, title, body } = this.props;

    if (focused) {
      // 포커스가 되어 있지 않을때만 실행한다
      if (title !== '' || body !== '') return; // 만약에 title 이나 body 가 비어있지 않다면 유지시킨다
      UIActions.blurInput();
    }
  };

  handleChange = e => {
    const { UIActions } = this.props;
    const { name, value } = e.target;

    UIActions.changeInput({ name, value });
  };

  handleCreate = async () => {
    const { title, body, cursor, MemoActions, UIActions } = this.props;
    try {
      // 메모 생성 API 호출
      await MemoActions.createMemo({
        title,
        body,
      });
      // 신규 메모를 불러옵니다
      // cursor 가 존재하지 않는다면, 0을 cursor 로 설정합니다.
      await MemoActions.getRecentMemo(cursor ? cursor : 0);
      UIActions.resetInput();
      // TODO: 최근 메모 불러오기
    } catch (e) {
      console.log(e); // 에러 발생
    }
  };

  render() {
    const { handleFocus, handleChange, handleCreate } = this;
    const { focused, title, body } = this.props;

    return focused ? (
      /* 포커스 된 상태 */ <WhiteBox>
        <InputSet onChange={handleChange} title={title} body={body} />
        <SaveButton onClick={handleCreate} />
      </WhiteBox>
    ) : (
      /* 포커스 풀린 상태 */ <WhiteBox onClick={handleFocus}>
        <InputPlaceholder />
      </WhiteBox>
    );
  }
}

export default connect(
  state => ({
    focused: state.ui.getIn(['write', 'focused']),
    title: state.ui.getIn(['write', 'title']),
    body: state.ui.getIn(['write', 'body']),
    cursor: state.memo.getIn(['data', 0, 'id']),
  }),
  dispatch => ({
    UIActions: bindActionCreators(uiActions, dispatch),
    MemoActions: bindActionCreators(memoActions, dispatch),
  }),
)(enhanceWithClickOutside(WriteMemo));

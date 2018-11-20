import React, { Component } from 'react';
import { connect } from 'react-redux';
import MemoList from 'components/MemoList';
import { bindActionCreators } from 'redux';
import * as uiActions from 'modules/ui';

class MemoListContainer extends Component {
  render() {
    const { memos, UIActions } = this.props;

    return <MemoList memos={memos} onOpen={UIActions.openViewer} />;
  }
}

export default connect(
  state => ({
    memos: state.memo.get('data'),
  }),
  dispatch => ({
    UIActions: bindActionCreators(uiActions, dispatch),
  }),
)(MemoListContainer);

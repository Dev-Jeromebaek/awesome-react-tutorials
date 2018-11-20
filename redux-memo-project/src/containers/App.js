import React, { Component } from 'react';
import Header from 'components/Header';
import Layout from 'components/Layout';
import WriteMemo from './WriteMemo';
import MemoListContainer from './MemoListContainer';
import MemoViewerContainer from './MemoViewerContainer';
import Spinner from 'components/Spinner';

import * as memoActions from 'modules/memo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class App extends Component {
  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    const { MemoActions } = this.props;
    // 초기 메모 로딩
    try {
      await MemoActions.getInitialMemo();
      this.getRecentMemo();
    } catch (e) {
      console.log(e);
    }
  }

  endCursor = 0;

  handleScroll = e => {
    const { clientHeight } = document.body;
    const { innerHeight } = window;

    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    console.log(clientHeight, innerHeight, scrollTop);
    if (clientHeight - innerHeight - scrollTop < 100) {
      const { endCursor, MemoActions } = this.props;

      // endCursor 가 없거나, 이전에 했던 요청과 동일하다면 여기서 멈춘다.
      if (!endCursor || this.endCursor === endCursor) return;
      this.endCursor = endCursor;

      MemoActions.getPreviousMemo(endCursor);
    }
  };

  getRecentMemo = () => {
    const { MemoActions, cursor } = this.props;
    console.log(cursor);
    MemoActions.getRecentMemo(cursor ? cursor : 0);

    // short-polling - 5초마다 새 데이터 불러오기 시도
    setTimeout(() => {
      this.getRecentMemo();
    }, 1000 * 5);
  };

  render() {
    const { pending } = this.props;
    return (
      <Layout>
        <Header />
        <Layout.Main>
          <WriteMemo />
          <MemoListContainer />
          <Spinner
            visible={
              pending['memo/GET_INITIAL_MEMO'] ||
              pending['memo/GET_PREVIOUS_MEMO']
            }
          />
        </Layout.Main>
        <MemoViewerContainer />
      </Layout>
    );
  }
}

export default connect(
  state => ({
    cursor: state.memo.getIn(['data', 0, 'id']),
    endCursor: state.memo.getIn([
      'data',
      state.memo.get('data').size - 1,
      'id',
    ]),
    pending: state.pender.pending,
  }),
  dispatch => ({
    MemoActions: bindActionCreators(memoActions, dispatch),
  }),
)(App);

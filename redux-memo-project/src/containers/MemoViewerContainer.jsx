import React, { Component } from 'react';
import MemoViewer from 'components/MemoViewer';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as uiActions from 'modules/ui';
import * as memoActions from 'modules/memo';

class MemoViewerContainer extends Component {
  handleChange = e => {
    const { UIActions } = this.props;
    const { name, value } = e.target;

    UIActions.changeViewerInput({
      name,
      value,
    });
  };

  handleUpdate = () => {
    const { MemoActions, UIActions, memo } = this.props;
    const { id, title, body } = memo.toJS();
    MemoActions.updateMemo({
      id,
      memo: { title, body },
    });
    UIActions.closeViewer();
  };

  handleDelete = () => {
    const { MemoActions, UIActions, memo } = this.props;
    const { id } = memo.toJS();
    MemoActions.deleteMemo(id);
    UIActions.closeViewer();
  };

  render() {
    const { visible, memo, UIActions } = this.props;
    const { title, body } = memo.toJS();
    const { handleChange, handleUpdate, handleDelete } = this;

    return (
      <MemoViewer
        visible={visible}
        title={title}
        body={body}
        onChange={handleChange}
        onClose={UIActions.closeViewer}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    );
  }
}

export default connect(
  state => ({
    visible: state.ui.getIn(['memo', 'open']),
    memo: state.ui.getIn(['memo', 'info']),
  }),
  dispatch => ({
    UIActions: bindActionCreators(uiActions, dispatch),
    MemoActions: bindActionCreators(memoActions, dispatch),
  }),
)(MemoViewerContainer);

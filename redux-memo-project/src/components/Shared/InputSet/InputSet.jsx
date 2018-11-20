import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

const TitleInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 1.25rem;
`;

const StyledTextArea = styled(Textarea)`
  width: 100%;
  width: 100%;
  border: none;
  outline: none;
  font-weight: 300;
  font-size: 1.1rem;
  margin-top: 1rem;
  resize: none;
`;

class InputSet extends Component {
  constructor(props) {
    super(props);
    this.title = React.createRef();
  }
  static propTypes = {
    onChange: PropTypes.func,
    title: PropTypes.string,
    body: PropTypes.string,
  };

  componentDidMount() {
    // 이 컴포넌트가 화면에 나타나면 제목 인풋에 포커스를 줍니다.
    // console.log(this.title.current);
    this.title.current.focus();
  }

  render() {
    const { onChange, title, body } = this.props;

    return (
      <div>
        <TitleInput
          name="title"
          onChange={onChange}
          placeholder="제목"
          ref={this.title}
          value={title}
        />
        <StyledTextArea
          minRows={3}
          maxRows={20}
          placeholder="메모를 입력하세요..."
          name="body"
          onChange={onChange}
          value={body}
        />
      </div>
    );
  }
}

export default InputSet;

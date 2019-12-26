import React from "react";
import PropTypes from "prop-types";

type ByeProps = {
  /** 보여주고 싶은 이름 */
  name: string;
};

const Bye = ({ name }: ByeProps) => {
  return <p>안녕히 가세요, {name}</p>;
};

Bye.defaultProps = {
  name: '...'
};

export default Bye;

import React, { useState } from "react";
import "./ResizableTextArea.scss";

const ResizableTextarea = (props) => {
  const [rows, setRows] = useState(1);
  const [minRows] = useState(1);
  const [maxRows] = useState(5);
  const [value, setValue] = useState("");
  const _textAreaRef = React.createRef();

  const handleChange = (event) => {
    const textareaLineHeight = 24;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    const value = event.target.value.replace("\n", "");

    setValue(value);
    setRows(currentRows < maxRows ? currentRows : maxRows);
  };

  const ignoreNewLine = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <textarea
      ref={_textAreaRef}
      maxLength="150"
      rows={rows}
      value={value}
      placeholder={"Give it a title..."}
      className={"textarea"}
      onChange={handleChange}
      style={props.style}
      onKeyDown={ignoreNewLine}
    />
  );
};

export default ResizableTextarea;

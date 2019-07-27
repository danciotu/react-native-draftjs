import React, { useState, createRef } from "react";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import EditorController from "./Components/EditorController/EditorController";

/**
 * For testing the post messages
 * in web
 */
// window.ReactNativeWebView ={};
// window.ReactNativeWebView.postMessage = value => console.log(value);

function App() {
  const _draftEditorRef = createRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [placeholder, setPlaceholder] = useState("");
  const [editorStyle, setEditorStyle] = useState("");
  const [styleMap, setStyleMap] = useState({});

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = e => {
    switch (e.keyCode) {
      case 9: // TAB
        const newEditorState = RichUtils.onTab(
          e,
          editorState,
          4 /* maxDepth */
        );
        if (newEditorState !== editorState) {
          setEditorState(newEditorState);
        }
        return;
      default:
        return getDefaultKeyBinding(e);
    }
  };

  const toggleBlockType = blockType => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = inlineStyle => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const setDefaultValue = html => {
    if (html) {
      setEditorState(stateFromHTML(html));
    }
  };

  const setEditorPlaceholder = placeholder => {
    setPlaceholder(placeholder);
  };

  const setEditorStyleSheet = styleSheet => {
    setEditorStyle(styleSheet);
  };

  const setEditorStyleMap = editorStyleMap => {
    setStyleMap(editorStyleMap);
  };

  const focusTextEditor = () => {
    _draftEditorRef.current && _draftEditorRef.current.focus();
  };

  const blurTextEditor = () => {
    _draftEditorRef.current && _draftEditorRef.current.blur();
  };

  window.toggleBlockType = toggleBlockType;
  window.toggleInlineStyle = toggleInlineStyle;
  window.setDefaultValue = setDefaultValue;
  window.setEditorPlaceholder = setEditorPlaceholder;
  window.setEditorStyleSheet = setEditorStyleSheet;
  window.setEditorStyleMap = setEditorStyleMap;
  window.focusTextEditor = focusTextEditor;
  window.blurTextEditor = blurTextEditor;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        editorState: stateToHTML(editorState.getCurrentContent())
      })
    );
  }

  return (
    <>
      <style>
        {`.public-DraftEditorPlaceholder-root{position: absolute;color: silver;pointer-events: none;z-index: -10000;}${editorStyle}`}
      </style>
      <Editor
        ref={_draftEditorRef}
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        placeholder={placeholder}
      />
      <EditorController
        editorState={editorState}
        onToggleBlockType={toggleBlockType}
        onToggleInlineStyle={toggleInlineStyle}
      />
    </>
  );
}

export default App;

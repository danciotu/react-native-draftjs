import React, { useState, createRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import { Map } from "immutable";
import EditorController from "./Components/EditorController/EditorController";
import ResizableTextarea from "./Components/ResizableTextArea";
import "./App.css";

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
  const [blockRenderMap, setBlockRenderMap] = useState(Map({}));
  const [isMounted, setMountStatus] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isMounted) {
      setMountStatus(true);
      /**
       * componentDidMount action goes here...
       */
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            isMounted: true
          })
        );
      }
    }
  }, [isMounted]);

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
    try {
      if (html) {
        setEditorState(EditorState.createWithContent(stateFromHTML(html)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setEditorTitle = title => {
    if (title && typeof title === "string") {
      setTitle(title);
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

  const setEditorBlockRenderMap = renderMapString => {
    try {
      setBlockRenderMap(Map(JSON.parse(renderMapString)));
    } catch (e) {
      setBlockRenderMap(Map({}));
      console.error(e);
    }
  };

  window.toggleBlockType = toggleBlockType;
  window.toggleInlineStyle = toggleInlineStyle;
  window.setDefaultValue = setDefaultValue;
  window.setEditorTitle = setEditorTitle;
  window.setEditorPlaceholder = setEditorPlaceholder;
  window.setEditorStyleSheet = setEditorStyleSheet;
  window.setEditorStyleMap = setEditorStyleMap;
  window.focusTextEditor = focusTextEditor;
  window.blurTextEditor = blurTextEditor;
  window.setEditorBlockRenderMap = setEditorBlockRenderMap;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        editorState: stateToHTML(editorState.getCurrentContent()),
        editorTitle: title
      })
    );
  }

  const customBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

  return (
    <div
      style={{
        flex: 1,
        flexDirection: "column",
        display: "flex",
        backgroundColor: "#FFFFFF",
        padding: "10px 10px",
        minHeight: "40vh",
        margin: "10px 10px",
        borderRadius: 20
      }}
    >
      <ResizableTextarea value={title} onValueChange={setTitle} />
      <div
        style={{
          width: "70px",
          height: "20px",
          backgroundColor: "red",
          zIndex: 9999,
          margin: "10px 0px",
          borderRadius: "20px"
        }}
      ></div>
      <style>
        {`.public-DraftEditorPlaceholder-root{position: absolute;color: silver;pointer-events: none;z-index: -10000;}${editorStyle}`}
      </style>
      <div
        style={{
          minHeight: 80,
          padding: 10,
          paddingTop: 0,
          cursor: "text"
        }}
        onClick={focusTextEditor}
      >
        <Editor
          ref={_draftEditorRef}
          customStyleMap={styleMap}
          blockRenderMap={customBlockRenderMap}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          placeholder={placeholder}
        />
      </div>

      <EditorController
        editorState={editorState}
        onToggleBlockType={toggleBlockType}
        onToggleInlineStyle={toggleInlineStyle}
      />
    </div>
  );
}

export default App;

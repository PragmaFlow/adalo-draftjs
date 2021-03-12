import React, { useState, createRef, useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";

import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { EditorController } from "./editor-controller";

export function Editor({
  initialText = "",
  placeholder = "",
  onChange,
  onBlur,
}) {
  const editorRef = createRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onEditorBlur = (e) => {
    const currentState = editorState.getCurrentContent();
    if (currentState) {
      const rawState = convertToRaw(currentState);
      if (rawState) {
        onBlur(JSON.stringify(rawState));
      }
    }
  };

  useEffect(() => {
    if (initialText) {
      try {
        setEditorState(
          EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
        );
      } catch {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, []);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onEditorStateChange(newState);
    }
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        onEditorStateChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <ScrollView>
      <EditorController
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <DraftEditor
        ref={editorRef}
        placeholder={placeholder}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        editorState={editorState}
        onChange={onEditorStateChange}
        onBlur={(e) => {
          onEditorBlur(e);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "grid",
    maxWidth: "100%",
  },
});

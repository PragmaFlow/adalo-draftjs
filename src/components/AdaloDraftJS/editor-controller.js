import React from "react";
import { RichUtils } from "draft-js";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BlockTypes = [
  { label: "H1", style: "header-one"},
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item", icon: <Icon name="format-list-bulleted" /> },
  { label: "OL", style: "ordered-list-item", icon: <Icon name="format-list-numbered" /> },
  { label: "Code Block", style: "code-block" },
];

const InlineStyles = [
  { label: "B", style: "BOLD", icon: <Icon name="format-bold" /> },
  { label: "I", style: "ITALIC", icon: <Icon name="format-italic" /> },
  { label: "U", style: "UNDERLINE", icon: <Icon name="format-underlined" /> },
  { label: "Monospace", style: "CODE", icon: <Icon name="format-quote" /> },
];

export function EditorController({
  editorState = {},
  setEditorState = (obj) => null
}) {
  const selection = editorState.getSelection();
  const editorBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();

  const setIterartor = currentStyle.values();
  let style = setIterartor.next();
  let styleString = "";
  while (!style.done) {
    if (styleString) styleString += "," + style.value;
    else styleString = style.value;
    style = setIterartor.next();
  }

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        blockType: editorBlockType,
        styles: styleString,
      })
    );
  }

  return (
    <View style={{ display: "flex", flex: 1, flexDirection: "row" }}>
      {InlineStyles.map((styleType, styleTypeIndex) => {
        return (
          <Text
            key={styleTypeIndex}
            style={{
              width: 50,
              height: 50,
              backgroundColor: currentStyle.has(styleType.style)
                ? "silver"
                : "white",
              margin: "4px 8px",
              borderRadius: 2,
              border: "1px solid black",
              padding: "4px 8px",
            }}
            onPress={(e) => {
              setEditorState(
                RichUtils.toggleInlineStyle(editorState, styleType.style)
              );
            }}
          >
            {styleType.icon ? styleType.icon : styleType.label}
          </Text>
        );
      })}
      {BlockTypes.map((blockType, blockTypeIndex) => {
        return (
          <Text
            key={blockTypeIndex}
            style={{
              width: 50,
              height: 50,
              backgroundColor:
                blockType.style === editorBlockType ? "silver" : "white",
              margin: "4px 8px",
              borderRadius: 2,
              border: "1px solid black",
              padding: "4px 8px",
            }}
            onPress={(e) => {
              setEditorState(
                RichUtils.toggleBlockType(editorState, blockType.style)
              );
            }}
          >
            {blockType.icon ? blockType.icon : blockType.label}
          </Text>
        );
      })}
    </View>
  );
}

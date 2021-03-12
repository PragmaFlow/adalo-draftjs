import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, AppRegistry } from "react-native";
import { Editor } from "./editor";

class AdaloDraftJS extends Component {
  handleLayout = ({ nativeEvent }) => {
    const { width } = (nativeEvent && nativeEvent.layout) || {};
    const { width: prevWidth } = this.state;

    if (width !== prevWidth) {
      this.setState({ width });
    }
  };

  render() {
    const { text, placeholder, onChange, onBlur } = this.props;
    return (
      <View onLayout={this.handleLayout}>
        <Editor
          initialText={text}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AdaloDraftJS;

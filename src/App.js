import React, { Component } from "react";
import "./App.css";
import a from "axios";
import pid from "pushid";
import { CodeMirror } from "react-codemirror2";
import Push from "pusher-js";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

class App extends Component {
  constructor() {
    super();
    this.state = {
      key: "",
      html: "",
      css: "",
      js: ""
    };

    this.pusher = new Push("", {
      cluster: "eu"
    });

    this.channel = this.pusher.subscribe("editor");
  }

this.channel.bind("update", data => {
      const { key } = this.state;
      if (data.key === key) return;

      this.setState({
        html: data.html, css: data.css, js: data.js
      });
    });
  }
  
 Mount() {
    this.setState({
      key: pid()
    });

 Drop() {
    this.setState({
      key: pid()
    });

  Update() {
    this.run();
  }

  sync = () => {
    const data = { ...this.state };

    a.post("https://localhost:5000/editor", data).catch(console.error);
  };

  run = () => {
    const { html, css, js } = this.state;

    const iframe = this.refs.iframe;
    const doc = iframe.contentDocument;
    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>App</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}

        <script type="javascript">
          ${js}
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(content);
    doc.close();
  };

  render() {
    const { html, js, css } = this.state;
    const codeenv = {
      lineNumbers: true,
      scrollbarStyle: null,
      lineWrapping: true
    };

    return (
      <div className="App">
        <section className="container">
          <div className="editor html">
            <div className="header">HTML</div>
            <CodeMirror
              value={html}
              options={{
                mode: "htmlmixed",
                ...codeenv
              }}
              onBeforeChange={(editor, data, html) => {
                this.setState({ html }, () => this.sync());
              }}
            />
          </div>
          <div className="editor css">
            <div className="header">CSS</div>
            <CodeMirror
              value={css}
              options={{
                mode: "css",
                ...codeenv
              }}
              onBeforeChange={(editor, data, css) => {
                this.setState({ css }, () => this.sync());
              }}
            />
          </div>
          <div className="editor js">
            <div className="header">JavaScript</div>
            <CodeMirror
              value={js}
              options={{
                mode: "javascript",
                ...codeenv
              }}
            />
          </div>
        </section>
        <section className="res">
          <iframe title="result" className="iframe" ref="iframe" />
        </section>
      </div>
    );
  }
}

export default App;

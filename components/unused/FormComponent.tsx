import React from "react";
import "./FormComponent.module.css";

const FormComponent: React.FC = () => {
  return (
    <div className="form-container">
      {/* Header Form */}
      <div className="form-row">
        <input type="text" placeholder="Name" className="form-input" />
        <input type="email" placeholder="Email" className="form-input" />
      </div>

      {/* Explanation */}
      <div className="form-section">
        <label className="form-label">Explanation</label>
        <div className="form-editor">
          <div className="form-toolbar">
            <button className="toolbar-btn">Image</button>
            <button className="toolbar-btn">Color</button>
            <button className="toolbar-btn">Text</button>
            <button className="toolbar-btn">Align</button>
            <button className="toolbar-btn">Link</button>
          </div>
          <textarea className="form-textarea" placeholder="Type ..." />
        </div>
      </div>

      {/* File Upload */}
      <div className="form-bottom-row">
        <div className="form-file-upload">
          <div className="upload-icon">&#128193;</div>
          <p className="upload-text">Drop Image Here, Paste Or</p>
          <button className="upload-button">+ Select</button>
        </div>
      </div>

      {/* Send Button */}
      <div className="form-send">
        <button className="send-button">
          <span className="send-icon">&#9993;</span> Send
        </button>
      </div>
    </div>
  );
};

export default FormComponent;

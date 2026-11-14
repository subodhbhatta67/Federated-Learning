// TryModel.jsx — upload an image and see what the trained model predicts.
import { useEffect, useState } from "react";
import { predict } from "../api.js";
import { MAX_UPLOAD_BYTES } from "../constants.js";
import { formatNumber } from "../utils/results.js";
import ProbabilityBars from "../components/ProbabilityBars.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function TryModel() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Make a preview URL for the chosen file, and free the old one when the
  // file changes or the page closes.
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Check a file and keep it if it is a usable image.
  function chooseFile(newFile) {
    if (!newFile) return;
    if (!newFile.type.startsWith("image/")) {
      setFileError("That file is not an image. Please choose a PNG or JPG.");
      return;
    }
    if (newFile.size > MAX_UPLOAD_BYTES) {
      setFileError("That image is larger than 5 MB. Please choose a smaller one.");
      return;
    }
    setFileError("");
    setFile(newFile);
    setResult(null); // old result belongs to the old image
    setError("");
  }

  function handleInputChange(e) {
    chooseFile(e.target.files[0]);
    e.target.value = ""; // allow choosing the same file again
  }

  // Drag-and-drop: preventDefault stops the browser from opening the file.
  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    chooseFile(e.dataTransfer.files[0]);
  }

  async function handleClassify() {
    setLoading(true);
    setError("");
    try {
      setResult(await predict(file));
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderResult() {
    if (loading) return <StatusMessage type="loading" />;
    if (error) return <StatusMessage type="error" message={error} />;
    if (!result) return <p className="hint">Upload an image and press Classify</p>;
    return (
      <>
        <p className="eyebrow">Prediction</p>
        <p className="big-name">{result.predicted_class}</p>
        <p className="confidence">Confidence: {formatNumber(result.confidence * 100, 1, "%")}</p>
        <h2 className="sub-title">All classes</h2>
        <ProbabilityBars probabilities={result.probabilities} predictedClass={result.predicted_class} />
        <p className="mock-note">
          The prediction service is not connected yet, so these numbers are placeholder data.
        </p>
      </>
    );
  }

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Try the model</h1>
        <p className="lead">
          Upload an image and see what the trained federated model predicts. It classifies 32×32
          images into 10 classes.
        </p>
      </header>

      <div className="two-col">
        <section className="card upload-card" aria-label="Upload an image">
          <div
            className={dragging ? "dropzone is-dragging" : "dropzone"}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 15V4" />
              <path d="M7.5 8.5 12 4l4.5 4.5" />
              <path d="M4 15v4h16v-4" />
            </svg>
            <p>Drop an image here, or</p>
            <input id="image-input" className="visually-hidden" type="file" accept="image/*" onChange={handleInputChange} />
            <label htmlFor="image-input" className="btn btn-secondary">
              Choose a file
            </label>
            <p className="dropzone-hint">PNG or JPG</p>
          </div>

          {fileError && <StatusMessage type="error" message={fileError} />}

          <p className="field-label">Preview</p>
          <div className="preview-box">
            {previewUrl ? <img src={previewUrl} alt="Preview of the chosen image" /> : <span>Your image</span>}
          </div>

          <button type="button" className="btn btn-primary" onClick={handleClassify} disabled={!file || loading}>
            {loading ? "Classifying..." : "Classify"}
          </button>
        </section>

        <section className="card result-card" aria-live="polite" aria-label="Prediction">
          {renderResult()}
          <p className="note">
            The model is trained on 32×32 CINIC-10 images, so photos that look very different may be
            misclassified.
          </p>
        </section>
      </div>
    </div>
  );
}

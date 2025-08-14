import * as React from "react"
import { useEffect, useState } from "react"

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = { marginTop: 0, marginBottom: 64, maxWidth: 320 }
const paragraphStyles = { marginBottom: 48 }
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}

const gistId = "ce87f2e0f7aa3c02205101ccd6d32f42";
const gistUser = "PKing70";

const IndexPage = () => {
  // Option 1 - Append gist script dynamically after mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://gist.github.com/${gistUser}/${gistId}.js`;
    script.async = true;
    const gistContainer = document.getElementById("gist-container");
    if (gistContainer) {
      gistContainer.innerHTML = "";
      gistContainer.appendChild(script);
    }
  }, []);

  // Option 2 - Auto-detect and fetch raw Gist file
  const [gistCode, setGistCode] = useState("");
  useEffect(() => {
    fetch(`https://api.github.com/gists/${gistId}`)
      .then(res => res.json())
      .then(data => {
        const files = data.files;
        const firstFileKey = Object.keys(files)[0];
        const rawUrl = files[firstFileKey].raw_url;
        return fetch(rawUrl);
      })
      .then(res => res.text())
      .then(code => setGistCode(code))
      .catch(err => console.error("Error fetching raw gist:", err));
  }, []);

  // Option 3 - Fetch gist HTML via JSON API
  const [gistHtmlJson, setGistHtmlJson] = useState("");
  useEffect(() => {
    fetch(`https://gist.github.com/${gistUser}/${gistId}.json`)
      .then(res => res.json())
      .then(data => setGistHtmlJson(data.div))
      .catch(err => console.error("Error fetching gist JSON:", err));
  }, []);

  // Option 4 - Raw Gist code with syntax highlighting (JavaScript) using CDN
  const [highlightedCode, setHighlightedCode] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.hljs) {
      fetch(`https://api.github.com/gists/${gistId}`)
        .then(res => res.json())
        .then(data => {
          const firstFileKey = Object.keys(data.files)[0];
          return fetch(data.files[firstFileKey].raw_url);
        })
        .then(res => res.text())
        .then(code => {
          const highlighted = window.hljs.highlight(code, { language: "javascript" }).value;
          setHighlightedCode(highlighted);
        })
        .catch(err => console.error("Error highlighting gist:", err));
    }
  }, []);

  // Option 5 - Raw Gist code with syntax highlighting (auto-detected language) using CDN
  const [highlightedCodeAuto, setHighlightedCodeAuto] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.hljs) {
      fetch(`https://api.github.com/gists/${gistId}`)
        .then(res => res.json())
        .then(async data => {
          const firstFileKey = Object.keys(data.files)[0];
          const file = data.files[firstFileKey];
          const rawUrl = file.raw_url;
          const filename = file.filename;
          const ext = filename.split(".").pop().toLowerCase();
          const code = await fetch(rawUrl).then(r => r.text());

          // Try to highlight using the extension if possible
          let highlighted;
          try {
            highlighted = window.hljs.highlight(code, { language: ext }).value;
          } catch {
            highlighted = window.hljs.highlightAuto(code).value;
          }
          setHighlightedCodeAuto(highlighted);
        })
        .catch(err => console.error("Error highlighting gist:", err));
    }
  }, []);

  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Transpiled Gist Samples</h1>
      <p style={paragraphStyles}>
        Don't Edit <code style={codeStyles}>src/pages/index.js</code> to update this page 😎
      </p>

      {/* Option 0 */}
      <p style={paragraphStyles}>Option 0: Original inline script (will not work in React/Gatsby)</p>
      <p>Script starts here</p>
      <script src={`https://gist.github.com/${gistUser}/${gistId}.js`}></script>
      <p>Script ends here</p>

      {/* Option 1 */}
      <p style={paragraphStyles}>Option 1: Script injection via useEffect</p>
      <div id="gist-container"></div>

      {/* Option 2 */}
      <p style={paragraphStyles}>Option 2: Raw Gist code (unstyled)</p>
      <pre style={{ background: "#f0f0f0", padding: "1em", overflowX: "auto" }}>
        <code>{gistCode}</code>
      </pre>

      {/* Option 3 */}
      <p style={paragraphStyles}>Option 3: JSON API HTML (styled like GitHub)</p>
      <div dangerouslySetInnerHTML={{ __html: gistHtmlJson }} />

      {/* Option 4 */}
      <p style={paragraphStyles}>Option 4: Raw Gist code with syntax highlighting (JavaScript)</p>
      <pre style={{ background: "#f0f0f0", padding: "1em", overflowX: "auto" }}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>

      {/* Option 5 */}
      <p style={paragraphStyles}>Option 5: Raw Gist code with syntax highlighting (auto-detected language)</p>
      <pre style={{ background: "#f0f0f0", padding: "1em", overflowX: "auto" }}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCodeAuto }} />
      </pre>
    </main>
  )
}

export default IndexPage

export const Head = () => (
  <>
    <title>Home Page</title>
    {/* Gist embed CSS */}
    <link rel="stylesheet" href="https://gist.github.com/stylesheets/gist/embed.css" />
    {/* Highlight.js CSS */}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
    {/* Highlight.js script */}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  </>
)
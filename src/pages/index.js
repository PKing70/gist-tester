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

  // Option 4 - Raw Gist code with syntax highlighting (JavaScript only)
  const [highlightedCode, setHighlightedCode] = useState("");
  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/gists/${gistId}`)
        .then(res => res.json())
        .then(data => {
          const firstFileKey = Object.keys(data.files)[0];
          const rawUrl = data.files[firstFileKey].raw_url;
          return fetch(rawUrl).then(res => res.text());
        }),
      import("highlight.js/lib/core"),
      import("highlight.js/lib/languages/javascript"),
    ]).then(([code, hljs, jsLang]) => {
      hljs.registerLanguage("javascript", jsLang.default);
      const result = hljs.highlight(code, { language: "javascript" });
      setHighlightedCode(result.value);
    }).catch(err => console.error("Error highlighting gist:", err));
  }, []);

  // Option 5 - Raw Gist code with syntax highlighting & auto language detection
  const [highlightedCodeAuto, setHighlightedCodeAuto] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const gistData = await fetch(`https://api.github.com/gists/${gistId}`).then(res => res.json());
        const firstFileKey = Object.keys(gistData.files)[0];
        const rawUrl = gistData.files[firstFileKey].raw_url;
        const filename = gistData.files[firstFileKey].filename;
        const ext = filename.split(".").pop().toLowerCase();

        const code = await fetch(rawUrl).then(res => res.text());

        const hljs = (await import("highlight.js/lib/core")).default;

        // Try to dynamically import language module based on extension
        let langModule;
        try {
          langModule = await import(`highlight.js/lib/languages/${ext}`);
        } catch {
          console.warn(`No highlight.js language found for extension: ${ext}, falling back to auto-detect`);
        }

        if (langModule) {
          hljs.registerLanguage(ext, langModule.default);
          const result = hljs.highlight(code, { language: ext });
          setHighlightedCodeAuto(result.value);
        } else {
          const result = hljs.highlightAuto(code);
          setHighlightedCodeAuto(result.value);
        }
      } catch (err) {
        console.error("Error in Option 5 highlighting:", err);
      }
    })();
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
      <p style={paragraphStyles}>Option 4: Raw Gist code with syntax highlighting (JavaScript only)</p>
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
    <link rel="stylesheet" href="https://gist.github.com/stylesheets/gist/embed.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
  </>
)
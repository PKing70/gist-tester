import * as React from "react"
import { useEffect, useState } from "react"

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  marginBottom: 24,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}

const docLink = {
  text: "Documentation",
  url: "https://www.gatsbyjs.com/docs/",
  color: "#8954A8",
}

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

const links = [
  {
    text: "Test1",
    url: "https://www.gatsbyjs.com/docs/tutorial/getting-started/",
    description:
      "First testA great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
  },
  {
    text: "Test2",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "Second test",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Third test",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Fourth test",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Fifth test",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    badge: true,
    description:
      "Can Gatsy cloud host this, or are there constrainbs?",
  },
]

const IndexPage = () => {
  // Option 1 - Append gist script dynamically after mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://gist.github.com/PKing70/ce87f2e0f7aa3c02205101ccd6d32f42.js";
    script.async = true;
    const gistContainer = document.getElementById("gist-container");
    if (gistContainer) {
      gistContainer.innerHTML = ""; // clear if re-rendered
      gistContainer.appendChild(script);
    }
  }, []);

  // Option 2 - Fetch gist HTML from GitHub API
  const [gistHtml, setGistHtml] = useState("");
  useEffect(() => {
    fetch("https://gist.github.com/PKing70/ce87f2e0f7aa3c02205101ccd6d32f42.js")
      .then(res => res.text())
      .then(js => {
        // This is just an example - normally you'd parse and sanitize
        setGistHtml(js);
      })
      .catch(err => console.error("Error fetching gist:", err));
  }, []);
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Transpiled Gist Samples
      </h1>
      <p style={paragraphStyles}>
        Editing <code style={codeStyles}>src/pages/index.js</code> updates this page 😎
      </p>      <p style={paragraphStyles}>
        Script starts here</p>
      <script src="https://gist.github.com/PKing70/ce87f2e0f7aa3c02205101ccd6d32f42.js"></script>
      <p>Script ends here</p>
      <p style={paragraphStyles}>Option 1: Script injection via useEffect</p>
      <div id="gist-container"></div>
      <p style={paragraphStyles}>Option 2: Pre-fetched Gist HTML (raw, not executed)</p>
      <div dangerouslySetInnerHTML={{ __html: gistHtml }} />
      <ul style={listStyles}>
        <li style={docLinkStyle}>
          <a
            style={linkStyle}
            href={`${docLink.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
          >
            {docLink.text}
          </a>
        </li>
        {links.map(link => (
          <li key={link.url} style={{ ...listItemStyles, color: link.color }}>
            <span>
              <a
                style={linkStyle}
                href={`${link.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
              >
                {link.text}
              </a>
              {link.badge && (
                <span style={badgeStyle} aria-label="New Badge">
                  NEW!
                </span>
              )}
              <p style={descriptionStyle}>{link.description}</p>
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>

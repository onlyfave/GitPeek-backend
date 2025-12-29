import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

app.get("/api/repos/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "github-finder-proxy",
        Accept: "application/vnd.github+json",
      },
    });

    if (ghRes.status === 403) {
      return res.status(ghRes.status).json({ message: "GitHub rate limit exceeded." });
    }

    const data = await ghRes.json();
    return res.status(ghRes.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Proxy running on http://localhost:${port}`);
});
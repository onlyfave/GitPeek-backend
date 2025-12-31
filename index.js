import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ 
    message: "GitHub Finder API",
    endpoints: [
      "GET /api/users/:username",
      "GET /api/users/:username/repos",
      "GET /api/repos/:owner/:repo/commits"
    ]
  });
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const response = await fetch(`https://api.github.com/users/${req.params.username}`, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional: use for higher rate limits
      }
    });
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/users/:username/repos', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${req.params.username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );
    if (!response.ok) throw new Error('Repos not found');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/repos/:owner/:repo/commits', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/commits?per_page=100`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );
    const data = await response.json();
    res.json(data || []);
  } catch (error) {
    res.json([]);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client lazily
  const getGeminiClient = (customKey?: string) => {
    const apiKey = customKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server or client settings.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // 1. Health check API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasCloudinaryConfig: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    });
  });

  // 2. ASK AKASH AI (Portfolio Knowledge-Grounded Gemini Assistant)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], portfolioContext, apiKey } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient(apiKey);

      const systemPrompt = `You are "Ask Akash AI", the personal AI assistant representing K AKASH, an AI/ML-focused full-stack developer and B.Tech Computer Science student.

STRICT INSTRUCTION:
- You must answer questions ONLY using the verified portfolio data provided below.
- Do NOT hallucinate or fabricate facts about Akash that are not in the portfolio context.
- If the user asks for information not present in the context, respond strictly with:
  "I don't have that information in Akash's portfolio."
- Maintain a highly professional, articulate, visionary, and humble tone.
- When answering "Why should I hire him?", use only the skills, projects, achievements, and certifications contained in the portfolio context.
PORTFOLIO KNOWLEDGE BASE:
${JSON.stringify(portfolioContext, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
          maxOutputTokens: 800,
        },
      });

      const reply = response.text || "I don't have that information in Akash's portfolio.";
      res.json({ reply });
    } catch (err: unknown) {
      console.error('Gemini chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to generate response from Ask Akash AI.',
        details: errorMessage,
      });
    }
  });

  // 3. RECRUITER SUMMARY GENERATOR
  app.post('/api/recruiter-summary', async (req, res) => {
    try {
      const { portfolioContext, roleFocus = 'General AI & Full Stack', apiKey } = req.body;
      const ai = getGeminiClient(apiKey);

       const prompt = `Generate a high-impact, executive Recruiter Summary for K AKASH based on this portfolio data:
${JSON.stringify(portfolioContext, null, 2)}

Target Role: ${roleFocus}

Format the response cleanly into structured Markdown sections:
1. Executive Snapshot (2-3 punchy sentences highlighting core value proposition)
2. Core Technical Strengths & Stack Mastery
3. Key Flagship Projects & Measurable Business Impact
4. Verified Credentials & Academic Standing
5. Why Akash is a High-Value Engineering Hire

Keep it concise, quantifiable, and tailored for senior tech recruiters and engineering directors.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      });

      res.json({ summary: response.text });
    } catch (err: unknown) {
      console.error('Recruiter summary error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  // 4. ROLE-SPECIFIC AI RESUME GENERATOR
  app.post('/api/generate-resume', async (req, res) => {
    try {
      const { role, portfolioContext, apiKey } = req.body;
      const targetRole = role || 'AI Engineer';
      const ai = getGeminiClient(apiKey);

      const prompt = `Generate a role-tailored professional resume for K Akash  for the position of "${targetRole}".

Use this verified portfolio data:
${JSON.stringify(portfolioContext, null, 2)}

Return a structured resume with:
- Professional Summary (tailored for ${targetRole})
- Core Technical Competencies
- Selected Flagship Projects (with technologies, problem, architecture, outcome metrics)
- Certifications & Credentials
- Education & Academic Honors
- Notable Hackathon & Research Achievements

Format strictly in clean, professional markdown with high readability.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.25,
          maxOutputTokens: 1500,
        },
      });

      res.json({ resumeMarkdown: response.text, role: targetRole });
    } catch (err: unknown) {
      console.error('Resume generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Akash Portfolio CMS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

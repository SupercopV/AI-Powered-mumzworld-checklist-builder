import { createReadStream, existsSync } from "node:fs";
import { stat, readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const publicPort = Number(process.env.PORT || 8787);
const allowedLanguages = new Set(["en", "ar", "both"]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "POST" && requestUrl.pathname === "/api/checklist") {
    return handleChecklistRequest(request, response);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  return serveFrontend(requestUrl.pathname, response);
});

async function handleChecklistRequest(request, response) {
  try {
    const payload = await readJsonBody(request);
    const validationError = validateChecklistPayload(payload);

    if (validationError) {
      return sendJson(response, 400, { error: validationError });
    }

    const { ageOrDueDate, budget, concerns, language, groqApiKey } = payload;
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 900,
        messages: [
          { role: "system", content: buildSystemPrompt(language) },
          {
            role: "user",
            content: buildUserPrompt({
              ageOrDueDate: ageOrDueDate.trim(),
              budget,
              concerns: concerns?.trim() || "",
            }),
          },
        ],
      }),
    });

    const responseData = await groqResponse.json().catch(() => ({}));

    if (!groqResponse.ok) {
      const apiError =
        responseData?.error?.message ||
        responseData?.error ||
        "Groq rejected the request.";

      return sendJson(response, groqResponse.status, {
        error: normalizeGroqError(apiError, groqResponse.status),
      });
    }

    const checklistText = responseData?.choices?.[0]?.message?.content?.trim();

    if (!checklistText) {
      return sendJson(response, 502, {
        error: "Groq returned an empty response. Please try again.",
      });
    }

    return sendJson(response, 200, {
      checklistText,
      meta: {
        language,
        model: responseData.model || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return sendJson(response, 400, { error: "Invalid JSON request body." });
    }

    return sendJson(response, 500, {
      error: "The server could not generate a checklist right now.",
    });
  }
}

function buildSystemPrompt(language) {
  const languageRules = {
    en: "Respond entirely in English.",
    ar: "Respond entirely in Arabic with natural phrasing for parents in the GCC.",
    both: "Respond in two sections only. Start with [[ENGLISH]] and then [[ARABIC]]. Use natural Arabic, not a literal translation.",
  };

  return `You are a knowledgeable baby product advisor for Mumzworld, the largest e-commerce platform for mothers in the Middle East (GCC).

Your job is to create a practical shopping checklist for a first-time mom.

Rules:
- Be practical and honest.
- Distinguish clearly between ESSENTIAL, NICE-TO-HAVE, and SKIP.
- Mention realistic AED price ranges for the GCC market.
- If the baby age or due date input is unclear or obviously out of scope, politely explain why you cannot help.
- Keep the answer warm, scannable, and concise.
- Group the advice into clear checklist sections.
- End with one short "Mom tip" tailored to the user's situation.
- ${languageRules[language]}`;
}

function buildUserPrompt({ ageOrDueDate, budget, concerns }) {
  return `Baby details:
- Age / due date: ${ageOrDueDate}
- Budget: ${budget}
- Special concerns: ${concerns || "none mentioned"}

Build a personalized shopping checklist.
For each item, include:
- whether it is ESSENTIAL, NICE-TO-HAVE, or SKIP
- a realistic AED price estimate or range
- a short reason tied to this baby situation`;
}

function validateChecklistPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body is required.";
  }

  if (!payload.ageOrDueDate || typeof payload.ageOrDueDate !== "string" || !payload.ageOrDueDate.trim()) {
    return "Baby age or due date is required.";
  }

  if (!payload.budget || typeof payload.budget !== "string") {
    return "Budget is required.";
  }

  if (!payload.groqApiKey || typeof payload.groqApiKey !== "string" || !payload.groqApiKey.trim()) {
    return "Groq API key is required.";
  }

  if (!allowedLanguages.has(payload.language)) {
    return "Language must be one of en, ar, or both.";
  }

  if (payload.concerns && typeof payload.concerns !== "string") {
    return "Concerns must be plain text.";
  }

  return "";
}

function normalizeGroqError(message, status) {
  if (status === 401 || status === 403) {
    return "Your Groq API key was rejected. Please check it and try again.";
  }

  if (status === 429) {
    return "Groq rate limited the request. Please wait a moment and try again.";
  }

  return `Groq error: ${message}`;
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

async function serveFrontend(requestPath, response) {
  const safePath = requestPath === "/" ? "/index.html" : path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(distDir, safePath);

  if (existsSync(filePath) && (await stat(filePath)).isFile()) {
    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
    return;
  }

  const indexPath = path.join(distDir, "index.html");

  if (!existsSync(indexPath)) {
    return sendJson(response, 404, {
      error: "Frontend build not found. Run `npm run build` before starting the production server.",
    });
  }

  const indexHtml = await readFile(indexPath);
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(indexHtml);
}

server.listen(publicPort, () => {
  console.log(`Mumzworld server running on http://localhost:${publicPort}`);
});

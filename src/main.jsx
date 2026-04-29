import React from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, Globe2, KeyRound, LoaderCircle, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "mumzworld.groqApiKey";
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "both", label: "Both" },
];

const BUDGET_OPTIONS = [
  "Under 500 AED",
  "500-1,500 AED",
  "1,500-3,000 AED",
  "3,000+ AED",
];

function App() {
  const [form, setForm] = React.useState({
    ageOrDueDate: "",
    budget: BUDGET_OPTIONS[1],
    concerns: "",
    language: "en",
  });
  const [groqApiKeyInput, setGroqApiKeyInput] = React.useState("");
  const [groqApiKeySaved, setGroqApiKeySaved] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    const savedKey = window.localStorage.getItem(STORAGE_KEY) || "";
    setGroqApiKeySaved(savedKey);
    setGroqApiKeyInput(savedKey);
  }, []);

  const hasSavedKey = Boolean(groqApiKeySaved);
  const activeApiKey = groqApiKeyInput.trim() || groqApiKeySaved;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveApiKey() {
    const nextKey = groqApiKeyInput.trim();
    if (!nextKey) {
      setError("Paste a Groq API key before saving it.");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, nextKey);
    setGroqApiKeySaved(nextKey);
    setGroqApiKeyInput(nextKey);
    setError("");
  }

  function clearApiKey() {
    window.localStorage.removeItem(STORAGE_KEY);
    setGroqApiKeySaved("");
    setGroqApiKeyInput("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.ageOrDueDate.trim()) {
      setError("Please enter your baby's age or due date to continue.");
      return;
    }

    if (!activeApiKey) {
      setError("Add your Groq API key to generate a checklist.");
      return;
    }

    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageOrDueDate: form.ageOrDueDate.trim(),
          budget: form.budget,
          concerns: form.concerns.trim(),
          language: form.language,
          groqApiKey: activeApiKey,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Could not generate the checklist right now.");
      }

      setResult(payload);
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError.message || "Something went wrong while generating your checklist.");
    }
  }

  const sections = result ? parseChecklist(result.checklistText, result.meta?.language || form.language) : null;

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">mumzworld AI Shopping Assistant</span>
          <h1>First-Time Mom Checklist Builder</h1>
          <p>
            Tell us about your baby, your budget, and any concerns. We&apos;ll generate a
            realistic shopping checklist with essentials, nice-to-haves, and what you can skip.
          </p>
          <div className="hero-points">
            <Feature icon={<Sparkles size={18} />} text="Personalized checklist in seconds" />
            <Feature icon={<Globe2 size={18} />} text="English, Arabic, or both" />
            <Feature icon={<ShieldCheck size={18} />} text="Your Groq key stays in your browser" />
          </div>
        </div>
        <div className="hero-badge">
          <span>Built for</span>
          <strong>Parents shopping smarter</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="panel-card settings-card">
          <div className="panel-header">
            <div>
              <p className="panel-label">Step 1</p>
              <h2>Add Groq API Key</h2>
            </div>
            <KeyRound size={20} />
          </div>
          <p className="panel-text">
            Paste your Groq key once to use the app locally. It will be saved in this browser only.
          </p>
          <label className="field">
            <span>Groq API Key</span>
            <input
              type="password"
              value={groqApiKeyInput}
              onChange={(event) => setGroqApiKeyInput(event.target.value)}
              placeholder="gsk_..."
              autoComplete="off"
            />
          </label>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={saveApiKey}>
              Save key
            </button>
            <button type="button" className="secondary-button" onClick={clearApiKey}>
              <Trash2 size={16} />
              Clear
            </button>
          </div>
          <p className={`status-chip ${hasSavedKey ? "ok" : "warning"}`}>
            {hasSavedKey ? "Groq key saved locally" : "No saved Groq key yet"}
          </p>
        </div>

        <form className="panel-card form-card" onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <p className="panel-label">Step 2</p>
              <h2>Build Your Checklist</h2>
            </div>
            <CheckCircle2 size={20} />
          </div>

          <div className="form-grid">
            <label className="field field-full">
              <span>Baby&apos;s age or due date</span>
              <input
                name="ageOrDueDate"
                value={form.ageOrDueDate}
                onChange={updateField}
                placeholder="e.g. 3 months, or due in 6 weeks"
              />
            </label>

            <label className="field">
              <span>Budget range (AED)</span>
              <select name="budget" value={form.budget} onChange={updateField}>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Response language</span>
              <select name="language" value={form.language} onChange={updateField}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-full">
              <span>Specific concerns</span>
              <textarea
                name="concerns"
                value={form.concerns}
                onChange={updateField}
                rows="4"
                placeholder="e.g. colic, breastfeeding, sensitive skin"
              />
            </label>
          </div>

          <button className="primary-button submit-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <LoaderCircle size={18} className="spin" />
                Building your checklist...
              </>
            ) : (
              "Build my checklist"
            )}
          </button>

          {error ? <div className="alert error-alert">{error}</div> : null}
        </form>
      </section>

      <section className="result-section">
        {status === "loading" ? (
          <div className="panel-card result-card loading-card">
            <LoaderCircle size={22} className="spin" />
            <div>
              <h2>Personalizing your checklist</h2>
              <p>We&apos;re asking Groq for a practical shopping list tailored to your situation.</p>
            </div>
          </div>
        ) : null}

        {result && sections ? (
          <article className="panel-card result-card">
            <div className="result-header">
              <div>
                <p className="panel-label">Your result</p>
                <h2>Personalized Mumzworld checklist</h2>
              </div>
              <div className="result-meta">
                <span>{form.ageOrDueDate}</span>
                <span>{form.budget}</span>
              </div>
            </div>

            {sections.english ? (
              <ChecklistSection title="English" content={sections.english} rtl={false} />
            ) : null}
            {sections.arabic ? (
              <ChecklistSection title="Arabic" content={sections.arabic} rtl />
            ) : null}
            {!sections.english && !sections.arabic ? (
              <ChecklistSection title="Checklist" content={result.checklistText} rtl={form.language === "ar"} />
            ) : null}
          </article>
        ) : null}

        {!result && status !== "loading" ? (
          <div className="panel-card result-card empty-card">
            <h2>Your checklist will appear here</h2>
            <p>
              Start with your Groq key, then fill in the baby details to generate a realistic,
              prioritized shopping list.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="feature-pill">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ChecklistSection({ title, content, rtl }) {
  return (
    <section className={`checklist-block ${rtl ? "rtl" : ""}`}>
      <div className="checklist-title">{title}</div>
      <div className="formatted-copy">
        {content.split("\n").map((line, index) => (
          <p key={`${title}-${index}`}>{line || "\u00A0"}</p>
        ))}
      </div>
    </section>
  );
}

function parseChecklist(text, language) {
  if (!text) return null;

  if (language === "both") {
    const englishMatch = text.match(/\[\[ENGLISH\]\]\s*([\s\S]*?)\s*\[\[ARABIC\]\]/i);
    const arabicMatch = text.match(/\[\[ARABIC\]\]\s*([\s\S]*)$/i);

    return {
      english: sanitizeSection(englishMatch?.[1] || ""),
      arabic: sanitizeSection(arabicMatch?.[1] || ""),
    };
  }

  if (language === "ar") {
    return { english: "", arabic: sanitizeSection(text) };
  }

  return { english: sanitizeSection(text), arabic: "" };
}

function sanitizeSection(value) {
  return value.replace(/\[\[(ENGLISH|ARABIC)\]\]/gi, "").trim();
}

createRoot(document.getElementById("root")).render(<App />);

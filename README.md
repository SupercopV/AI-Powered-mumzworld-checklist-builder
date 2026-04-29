# Mumzworld AI Checklist Builder

**Track:** B

## One-Paragraph Summary

I built **Mumzworld Checklist Builder**, an AI-powered planning assistant for a first-time mom who feels overwhelmed by what to buy before her baby arrives. The prototype asks for her baby stage, budget, concerns, and preferred language, then generates a practical shopping checklist in English, Arabic, or both, labeling items as `ESSENTIAL`, `NICE-TO-HAVE`, or `SKIP`. The goal is to help a high-intent Mumzworld shopper move from uncertainty to confident product discovery without overspending.

## Prototype Access

- **Live prototype URL or Loom of it working:** `https://www.loom.com/share/25d45a9ad81d48a9a0dbca4075abbf53`
- **3-minute walkthrough Loom:** `https://www.loom.com/share/25d45a9ad81d48a9a0dbca4075abbf53`
- **Code/project folder:** `C:\Users\lenovo\Documents\Mumzworld`

## Discovery

### Persona

**Name:** Aisha  
**Situation:** 29 years old, first pregnancy, due in 6 weeks, lives in Dubai, budget-conscious but willing to spend where it matters  
**What she is trying to do:** Figure out what she actually needs to buy before the baby arrives without wasting money on unnecessary items

### How I Shopped Mumzworld

I approached Mumzworld as Aisha rather than as a general browser. The goal was not “find a stroller” or “buy diapers.” The goal was much fuzzier: build confidence around an entire shopping plan.

That made the experience feel different from a standard e-commerce task. I was not mainly choosing between products. I was trying to answer questions like:

- What do I need first?
- What can wait?
- What is overhyped?
- What matters if I have a limited budget?
- What changes based on breastfeeding, sensitive skin, or newborn stage?

### What Bugged Me

The most important friction I identified was this: **the hardest part happens before product comparison.**

The catalog can help once a mom knows what she wants. But a first-time mom often does not start there. She starts with uncertainty. That uncertainty creates three problems:

- decision fatigue from too many categories and products
- fear of buying the wrong things or missing essentials
- pressure to overspend “just in case”

### Other Problems I Considered

I considered a few adjacent issues:

- category navigation could be simplified
- merchandising bundles could be better organized
- search could better understand natural-language queries
- product pages could explain stage relevance more clearly

### Why I Picked This Problem

I chose planning uncertainty over the others because it sits earlier in the funnel and influences everything after it. If Mumzworld helps a first-time mom answer “what should I buy for my situation?”, then navigation, product discovery, and conversion all become easier.

This felt more high-leverage than a local UX fix because it addresses the user’s mental model, not just an interface surface.

## Why AI

AI is the right tool here because the problem is not just finding products. It is translating a messy personal situation into a useful plan.

A normal UX fix could improve layout. A merchandising fix could create bundles. An ops fix could improve catalog readiness. But none of those fully solve the core issue: different moms need different advice depending on stage, budget, concerns, and language.

This is where AI helps:

- it can personalize the checklist based on multiple inputs at once
- it can explain *why* an item matters or does not matter
- it can generate multilingual guidance naturally
- it can adapt tone and prioritization without requiring dozens of manually maintained static flows

Why not just a button or static checklist?

Because a static checklist is too generic for the decision being made. If a simple UI change could answer “what should I buy, in what priority, for my exact situation?”, then AI would be unnecessary. In this case, the variability of the user need is the reason AI is justified.

## Show Your Work

### Tools Used

- **Codex / ChatGPT-style coding assistant:** used for planning, implementation support, debugging, and packaging the submission
- **Groq API:** used for runtime checklist generation
- **React + Vite:** used to build the frontend prototype quickly
- **Node.js HTTP server:** used to create a real backend endpoint for the prototype
- **Local browser storage:** used to store the user-entered Groq key for testing
- **Loom:** intended for the final walkthrough recording

### Timeline Log

- **0:00-1:00** Discovery pass. Defined the persona, shopped the problem space as a first-time mom, listed multiple friction points, and selected planning uncertainty as the highest-leverage problem.
- **1:00-2:00** Shaped the solution concept and converted the original static checklist idea into a product direction with multilingual support, budget input, and concerns input.
- **2:00-3:30** Built the frontend flow and restyled the app around the Mumzworld use case.
- **3:30-4:30** Added the backend API, connected Groq, handled validation/errors, and made the prototype actually work end to end.
- **4:30-5:30** Fixed local run issues on Windows, tested the flow, and prepared the final README, measurement plan, and Loom script.

### Prompts That Mattered

1. **"make this project working in real with backend and give me feature to add groq Api key to run it"**  
   This prompt forced the project out of mock/demo mode and into a working end-to-end product.

2. **"PLEASE IMPLEMENT THIS PLAN"** followed by the concrete product spec  
   This helped turn a vague idea into a buildable scope with clear interface and backend requirements.

3. **"do 1 + 4 first"**  
   This shifted focus from only building the product to packaging the work as a real submission with narrative and demo support.

4. **"read track B"**  
   This changed the framing of the deliverable. The brief made it clear that process visibility mattered as much as the prototype.

5. **"do it"** in response to restructuring the README  
   This finalized the shift from a product README to a Track B submission artifact.

### Dead Ends

- I initially treated the deliverable too much like a product demo and not enough like an evaluation artifact.  
  **Learned:** the submission needs raw thinking and process evidence, not just a working app.

- I first relied on a frontend-only version that called a model API directly.  
  **Learned:** that is not a credible “real” prototype because it lacks a proper backend boundary.

- I reused a workspace that originally contained a different demo app.  
  **Learned:** repurposing saved time, but it created naming/path confusion that had to be cleaned up.

- The initial dev launcher failed on Windows with `spawn EINVAL`.  
  **Learned:** local developer ergonomics matter; even simple tooling needs platform-safe handling.

- I tried to verify the PDF brief programmatically with missing local PDF libraries.  
  **Learned:** when tooling is limited, rely on the actual brief text and align tightly to the written requirements.

### Cuts From Scope

- I did not connect the checklist to real Mumzworld SKUs or category pages.
- I did not add user accounts or saved checklist history.
- I did not build analytics instrumentation into the prototype.
- I did not create a mobile-native or chat-native version.
- I did not add safety review workflows for health-adjacent guidance.

What would have made me reconsider scope cuts:

- access to real catalog/category data
- another 5 to 8 hours to implement post-checklist product actions
- clearer evaluation preference for production integration over concept validation

### Reflection

- The highest-leverage problem was not search or navigation; it was pre-shopping uncertainty.
- The brief rewards honest process visibility more than polished storytelling.
- AI felt justified only after I framed the problem as personalized planning, not recommendation fluff.
- Multilingual output made the prototype feel more regionally relevant very quickly.
- With another 5 hours, I would connect the generated checklist to real product pathways instead of stopping at advice.

## Measurement

### Single Leading Indicator for Week 1

**Checklist completion rate**

This is the best Week 1 leading indicator because it measures whether moms find the entry point relevant enough to start and the experience useful enough to finish. If users do not complete the checklist, downstream shopping impact will not matter.

### 5% Experiment Plan

I would launch the checklist builder to **5% of eligible traffic**, specifically shoppers in baby/preparation journeys such as first-time, registry, newborn, or due-soon contexts.

- **Control:** current experience without the AI checklist entry point
- **Test:** current experience plus entry into the AI checklist builder

I would watch for three early signals:

- checklist completion rate
- click-through from checklist to categories or products
- add-to-cart rate from users exposed to the checklist

### What Would Tell Me It Is Working

I would consider the experiment promising if the test group shows:

- strong checklist completion among exposed users
- clear downstream clicks into shopping after checklist generation
- better add-to-cart behavior than control, even before full conversion data stabilizes

### What Would Tell Me It Is Flatlining

I would consider it flatlining if:

- very few exposed users start the checklist
- completion is low because the flow feels too long or vague
- generated output does not lead to shopping actions
- Arabic/bilingual usage is low in a context where it should matter

## AI Usage Note

Used a coding LLM assistant for planning, implementation, debugging, and writing support.  
Used Groq for runtime generation of personalized shopping checklists.  
Used React/Vite for the UI and Node.js for the backend.  
No retailer scraping was used.  
The prototype relies on user input plus prompt-based generation.

## Time Log

- Discovery: ~1 hour
- Solution design and scope definition: ~1 hour
- Frontend build: ~1.5 hours
- Backend integration and debugging: ~1 hour
- Submission packaging and docs: ~1 hour

## Appendix

### Local Run Instructions

```bash
cd "C:\Users\lenovo\Documents\Mumzworld"
npm install
npm run dev
```

Open `http://localhost:5173`.

### Notes

- The app supports English, Arabic, and bilingual output.
- The Groq API key is stored in browser local storage for prototype testing.
- The backend does not persist the API key.
- No live Mumzworld catalog data is used in this prototype.


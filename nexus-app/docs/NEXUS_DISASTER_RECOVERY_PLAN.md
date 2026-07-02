# NEXUS Disaster Recovery Plan v1

## Project Identity

Project Name: NEXUS v2
Goal: AI Business Operating System
Local Folder: C:\PROJECTS\NEXUS 1\nexus-app
GitHub Repo: https://github.com/celerishealth/NEXUS

## Current Stable Commit

Day 7 Stable Commit:
63d93fa

Commit Message:
Day 7: add universal smart order parser and zero stop fallback

## Important Safety Rule

.env.local contains GEMINI_API_KEY.
Never upload .env.local to GitHub.

## If Laptop Crashes

1. Install Git
2. Install Node.js
3. Open terminal
4. Run:

git clone https://github.com/celerishealth/NEXUS.git

5. Open project:

cd NEXUS/nexus-app

6. Install packages:

npm install

7. Create .env.local manually
8. Add GEMINI_API_KEY inside .env.local
9. Run app:

npm run dev

## If Code Breaks

Check status:

git status --short

Restore last clean version:

git restore .

If needed, go back to Day 7 stable commit:

git checkout 63d93fa

## If Gemini Fails

NEXUS Zero Stop Policy is active.

Gemini success = AI response
Gemini quota/network fail = NEXUS Continuity Engine local fallback response

## Current Rule

NEXUS must not show raw API errors to users.
NEXUS must provide a clean fallback response.
NEXUS must protect business from uncontrolled automation.

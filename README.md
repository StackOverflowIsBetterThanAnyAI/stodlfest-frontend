# Stodlfest Frontend

Get excited for the upcoming Stodlfest!

Create preparation tasks. Add members and assign them tasks for the event. For a more enjoyable user experience, all tasks can also be completed in a conversation with the Dieter.ai bot.

<img width="1394" height="928" alt="Image" src="https://github.com/user-attachments/assets/fa75bfeb-2f49-4329-9cc7-c5df61b8faad" />

## E2E Tests

The Cypress tests create their own users and data, so they must never run against the production backend. `scripts/audit/start-backend.sh` starts a separate backend with a new SQLite database and writes its address into `.env.audit.local`. Cypress only takes the backend from this file and refuses to start without it. Requests of the app to any other backend are blocked and fail the test, e.g. if the app under test is a dev server that uses another backend.

```
AUDIT_HOST=127.0.0.1 bash scripts/audit/start-backend.sh
npx vite --port 5173 --host 127.0.0.1 --mode audit
npm run cy:run
```

Use `AUDIT_BACKEND_PORT` if port `8000` is already in use and `CYPRESS_BASE_URL` for another port of the app. The answers of the chatbot are replaced in the tests, so no Gemini API key is needed. The workflow `.github/workflows/e2e.yml` runs the tests on every push and pull request.

## Stodlfest Backend

[Stodlfest Backend Repository](https://github.com/StackOverflowIsBetterThanAnyAI/stodlfest-backend)

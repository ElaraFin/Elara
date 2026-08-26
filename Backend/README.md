# Elara Backend

FastAPI backend for the Elara mobile app.

This backend handles server-side integrations that must not expose secrets inside the mobile app, starting with the WealthAPI bridge.

## Current features

- FastAPI health check
- WealthAPI mock asset preview
- WealthAPI real sandbox preview path
- WealthAPI backend status endpoint
- Safe handling of missing sandbox token

## Setup

From the backend folder:

```bash
cd /Users/federicogiusti/Desktop/Elara-mobile-push/Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run backend

```bash
cd /Users/federicogiusti/Desktop/Elara-mobile-push/Backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment variables

Create a local `.env` file inside `Backend/`. Do not commit this file.

```env
WEALTH_API_BASE_URL=https://sandbox.wealthapi.eu
WEALTH_API_BEARER_TOKEN=
WEALTH_API_POLL_INTERVAL_SECONDS=1.5
WEALTH_API_REPORT_MAX_ATTEMPTS=20
```

At the moment, `WEALTH_API_BEARER_TOKEN` can stay empty.

When the WealthAPI sandbox token is available, add it only inside `Backend/.env`.

Never put WealthAPI tokens inside the mobile app or Expo public environment variables.

## Health check

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "elara-backend"
}
```

## WealthAPI status

```bash
curl http://127.0.0.1:8000/wealthapi/status
```

Without sandbox token, expected mode is:

```text
mock-only
```

With sandbox token configured, expected mode is:

```text
sandbox-ready
```

## WealthAPI mock preview

```bash
curl -X POST "http://127.0.0.1:8000/wealthapi/assets/preview/mock" \
  -H "Content-Type: application/json" \
  -d '{"provider":"Mock Brokerage"}'
```

This endpoint returns mock WealthAPI-like assets mapped to the Elara asset format.

## WealthAPI real sandbox preview

```bash
curl -X POST "http://127.0.0.1:8000/wealthapi/assets/preview" \
  -H "Content-Type: application/json" \
  -d '{"provider":"wealthAPI","imported_from_bank":true}'
```

Without sandbox token, expected response is:

```json
{
  "detail": "Missing WEALTH_API_BEARER_TOKEN. Add it to Backend/.env when sandbox is active."
}
```

This is correct until the real sandbox token is available.

## Mobile testing

Backend:

```bash
cd /Users/federicogiusti/Desktop/Elara-mobile-push/Backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expo:

```bash
cd /Users/federicogiusti/Desktop/Elara-mobile-push/App/elara-mobile
npx expo start -c --lan
```

Then on iPhone:

```text
Settings → WealthAPI
```

Useful checks:

- Check WealthAPI backend status
- Test WealthAPI backend mock
- Test WealthAPI real sandbox
- Import mock WealthAPI assets

## Security rules

- Do not commit `Backend/.env`
- Do not commit `App/elara-mobile/.env.local`
- Do not put WealthAPI bearer tokens inside Expo variables
- Do not expose service-role keys inside the mobile app
- Mobile calls the backend
- Backend calls WealthAPI
- User-owned asset writes currently happen from the mobile app through Supabase Auth

# 2026 Team PTO Planner

Public source for the [2026 Team PTO Planner](https://team-pto-2026.guzmanyessenia97.chatgpt.site/).

## Planner contents

The current data and calendar configuration are in `app/page.tsx`. This public repository contains real staff names, PTO dates, and projected balances. The calendar currently displays December 2026 and January 2027. Supervisor approval controls are labeled for Claudia and Kindra.

Approval decisions are saved in the browser's local storage. They are not shared across browsers or devices, and the planner does not authenticate approvers.

## Run locally

Requires Node.js 22.13 or later, Bash, and GNU `timeout`.

```sh
npm ci
npm run dev
```

The production build command is `npm run build`.

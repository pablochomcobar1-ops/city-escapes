# Security checklist: City Escapes

Last reviewed: 9 Nov 2026 · by Pablo Chomcobar

No site is unhackable. This one is hardened to a professional standard **for what it is today:
a static concept site with no server code, no database, no logins and no payments.** Most
server-side items in the brief therefore have nothing to protect yet. They are listed under
"Not applicable yet" with what to do the day that changes, so nothing gets forgotten.

## ✅ Done

| Area | What is in place | Where |
|---|---|---|
| HTTPS | HSTS for 2 years, including subdomains, preload-ready. Vercel serves HTTPS only and redirects HTTP. | `next.config.ts` |
| Content-Security-Policy | Scripts, styles, images, video, fonts and connections load from this site only. No plugins (`object-src 'none'`), no `<base>` hijack, forms post only to this site, no framing. | `next.config.ts` |
| Other headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (clickjacking), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` switches off camera, mic, location, payment and USB, `Cross-Origin-Opener-Policy: same-origin`, `X-Powered-By` removed. | `next.config.ts` |
| Proof the policy works | Tests check every header on every page, and that no page (the 3D tour included) triggers a single CSP violation. A deliberately injected outside script and image were blocked and reported, so the check can fail. | `tests/e2e/headers.spec.ts` |
| Input validation | Every booking field is checked against a strict schema: name letters only (2–60), Indian mobile format, date between today and 60 days ahead, fixed choices for slot and flat. Inputs have length limits. | `lib/booking.ts` |
| Output safety | React escapes everything shown on screen. No `dangerouslySetInnerHTML` with user input. The WhatsApp message is URL-encoded. | `lib/whatsapp.ts` |
| Spam protection | Hidden trap field plus a "submitted faster than a person could" check. Bots see the normal thank-you screen. | `lib/booking.ts`, `BookingForm.tsx` |
| External links | WhatsApp opens with `rel="noopener noreferrer"`, so the new tab cannot control this one. | `BookingForm.tsx` |
| Secrets | No secrets in code (scanned). The only setting, the WhatsApp number, is public by design. `.gitignore` blocks every `.env*` file except `.env.example`, and this was tested. | `.gitignore`, `.env.example` |
| Dependencies | `npm audit`: 0 vulnerabilities (all packages and production only). Supply-chain audit: see below. Exact versions pinned, lockfile committed. | `package-lock.json` |
| Automatic updates | Dependabot checks weekly and opens a pull request for updates and security fixes. Nothing merges without you. | `.github/dependabot.yml` |
| Error handling | Styled error page with "Try again" when part of a page crashes, and a fallback screen if the whole layout fails. Details go to the browser console, not to visitors. Styled 404. | `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` |
| Source maps | Not shipped to browsers in production (Next.js default), so the original source isn't published. | (default) |
| Backups | The code lives in Git with full history on GitHub, and every Vercel deploy is kept and can be rolled back in one click. There is no user data to back up. | GitHub, Vercel |

## Supply-chain audit (Trail of Bits supply-chain-risk-auditor, 9 Nov 2026)

- **Advisories:** none known for any of the 24 direct dependencies at their resolved versions, nor for any of the 235 registry-verified packages in the lockfile.
- **Install scripts:** none among direct dependencies. The only one in the tree is `fsevents`, an optional macOS-only dev package; it does not install on Windows. `npm ci --ignore-scripts` works for this project if wanted.
- **Single publisher:** `gsap` and `@gsap/react` (production) are published by one account (greensock); the four `@types/*` packages (build only) are published by one account (types). These are widely used (8,085,340 and 1,542,130 downloads a week for the GSAP packages). Pinned versions plus Dependabot review limit the exposure; no replacement is needed.
- **Not checked:** 5 lockfile entries bundled inside Tailwind's optional WebAssembly fallback (`@emnapi/core`, `@emnapi/wasi-threads`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`, `tslib` 2.8.1). They are dev-only and only install on platforms without a native Tailwind build.
- **Coverage limit:** repository-level checks (archived repos, maintenance activity, upstream CI hygiene) could not run because the GitHub API did not answer during the audit. "No findings" there means "not measured", not "clean".

## ⚠️ Still at risk (honest list)

1. **CSP allows inline scripts (`'unsafe-inline'`).** The pre-paint theme script and Next.js's static pages need it. If an attacker ever found a way to inject HTML, inline script would run. Today there is no place for that: there is no stored or reflected user content. Fix later: per-request nonces, which means giving up fully static pages.
2. **CSP allows inline styles.** GSAP, Lenis and React set styles inline. Style injection is low impact (no script), and this is standard for animated sites.
3. **The spam guard runs only in the browser.** A bot that skips the page skips the guard. This is fine while nothing is sent anywhere; the server must repeat it once bookings are stored.
4. **Errors are only logged to the visitor's console.** You won't hear about crashes on other people's phones. Fix: a free error-tracking tier (e.g. Sentry). That needs an account and a CSP change, so ask first.
5. **Debug hook.** `/tour?debug` exposes the camera position on `window` for testing. It reveals nothing sensitive, but can be removed before a real launch.
6. **Third-party code you trust:** Next.js, React, three.js, GSAP and Lenis run in the browser with full page access. That is unavoidable for any modern site; pinning and reviewed updates are the mitigation.
7. **Accounts.** The weakest link is usually a login, not the code. Turn on two-factor login for GitHub and Vercel.

## ⏳ Not applicable yet: do these the day the site gets a backend

| Brief item | When it applies | What to do |
|---|---|---|
| Server-side validation and sanitising | Bookings are actually sent | Re-run `bookingSchema` in the API route; never trust the browser. Re-run `looksLikeBot` there too. |
| Parameterised queries | A database is added | Use an ORM or query builder (Prisma, Drizzle) or `$1` placeholders; never build SQL from strings. |
| Auth: hashed passwords, secure cookies, CSRF | An admin area is added | Use a maintained auth library (Auth.js or similar). Passwords hashed with argon2id or bcrypt. Cookies `HttpOnly; Secure; SameSite=Lax`. CSRF tokens on every form that changes data. |
| Admin pages behind login with roles; least privilege | Same | Roles such as `admin` and `sales`. Check the role on the server for every request, not just by hiding buttons. The database user gets only the permissions it needs. |
| Rate limiting on forms and login | Same | e.g. 5 bookings and 5 login attempts per IP per 10 minutes (Upstash Ratelimit or Vercel's firewall). |
| Secrets only in environment variables | Any API key appears | Put it in Vercel → Project → Settings → Environment Variables. Never use the `NEXT_PUBLIC_` prefix for secrets: that prefix ships them to the browser. |
| Payments | Never planned for this site | Only the provider's hosted checkout (Razorpay or Stripe). Never touch or store card numbers. Verify payment webhooks with their signature. |
| Data backups | A database is added | Turn on the provider's daily automatic backups and test one restore. |

## How to re-check

```
npm audit --omit=dev
npm run test
npm run test:e2e
```
After deploying, paste the live URL into securityheaders.com: it should score A.

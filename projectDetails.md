Vision & MVP Scope

Goal: A PWA that lets small groups track shared expenses per "trip/event," invite friends by username, auto-extract receipt line items via OCR, and let users share/upload QR codes so others can pay them directly.

MVP features (simplified for personal use):
	1.	Mobile-first responsive web app (PWA ready: installable, offline-friendly basics)
	2.	Simple user management (no authentication required)
	3.	Create "Trips/Events"
	4.	Add participants by name (owner adds people directly)
	5.	Personal dashboard shows: trips, what you owe/are owed, and to whom
	6.	OCR: upload/take photo of receipt → extract line items, tax, total; confirm then save as expense
	7.	User-managed payment QR codes (upload image or generate from a pay link); show per-user in settlement UI

⸻

Architecture (mobile-first, web)

Front end
	•	Next.js (React) + Tailwind; PWA (service worker, manifest)
	•	State: Zustand (unified state management with persistence plugins for caching)
	•	Camera & file: input capture + getUserMedia fallback; client-side image downscaling before upload
	•	Accessibility: large tap targets, bottom nav, skeleton loaders

Back end
	•	Next.js API routes + SQLite via Prisma (simplified for personal use)
	•	No authentication required - direct access for trusted users
	•	Storage: Local file storage for receipt/QR images (base64 in database for MVP)
	•	Async OCR pipeline: Queue (Redis + BullMQ). Worker service (Python + FastAPI) running Tesseract or a cloud OCR (toggle by env)
	•	Real-time updates: WebSocket for expense updates (bi-directional communication)
	•	Observability: structured logs, basic metrics

Why split OCR into a worker? Uploads return fast; heavy OCR parsing runs async; user sees a "Draft expense" that updates when OCR completes.

⸻

Data Model (ERD-lite) - Simplified
	•	User(id, name, avatar_url, qr_code, total_owed, total_owing, created_at)
	•	Trip(id, name, description, currency_code [default: 'PHP'], created_by, start_date, end_date, is_active, created_at)
	•	TripMember(trip_id FK, user_id FK, role [creator|member], joined_at)
	•	Expense(id, trip_id FK, title, description, amount, currency_code [default: 'PHP'], date, paid_by, split_type [equal|percentage|exact|shares], is_settled, receipt_url, ocr_data, created_at)
	•	ExpenseSplit(id, expense_id FK, user_id FK, amount_owed) - for tracking how expenses are split
	•	SettlementSuggestion(id, trip_id FK, from_user_id, to_user_id, amount, created_at)

Notes:
	•	Balances are derived; keep denormalized rollups (materialized view or cached table) if needed for speed.
	•	Single currency per trip: Philippine Peso (PHP) for MVP; multi-currency support planned for future.

⸻

Core User Flows & Acceptance Criteria

1) Account creation (username/password)
	•	Flow: Sign up → unique, case-insensitive username → log in → land on Dashboard
	•	AC:
	•	Username must be unique (case-insensitive) and 3–30 chars, alnum + underscore
	•	Password stored with Argon2id; minimum complexity checks
	•	Session uses HttpOnly cookies; refresh rotation; logout invalidates session

2) Create Trip/Event
	•	Flow: + New Trip → name + currency (default: PHP) → create
	•	AC:
	•	Creator becomes owner and a member
	•	Trip appears on owner's Dashboard
	•	Only members can view trip content

3) Invite by username
	•	Flow: Owner searches exact username → send invite
	•	AC:
	•	Prevent duplicate invites/pending membership
	•	Invite shows on invitee's Dashboard within seconds (WebSocket push)
	•	Accept → creates TripMember; Decline → closes invite

4) Add expense (manual or OCR)
	•	Flow: In a trip → Add Expense → (a) Manual entry or (b) Upload/Take photo
	•	OCR pipeline:
	1.	Upload image (client downsizes to max 1600px, validates format/size)
	2.	Job enqueued → worker does pre-processing (grayscale, de-skew, denoise)
	3.	OCR (Tesseract/cloud) → parse vendor, line items, tax, total
	4.	Return structured draft → user MUST review/confirm before saving
	5.	User can edit any field, merge/split lines, mark items as personal vs shared
	6.	On save: splits persisted; payer credited; per-user balances update
	•	Splitting options: equal / percent / exact / shares (e.g., 1,2,1 among 3 people)
	•	Split templates: "Split by nights", "Split by meals", "Custom"
	•	AC:
	•	OCR must return: line_items[], subtotal (if found), tax, total; confidence per field
	•	User MUST review OCR results before saving (no auto-save)
	•	Receipt validation: file size <5MB, format: jpg/png, image quality check
	•	Retry logic for failed OCR attempts (max 3 attempts)
	•	On save: splits persisted; payer credited; per-user balances update

5) Dashboard & Trip views
	•	Dashboard:
	•	Your Trips: cards with net position (You owe / You're owed)
	•	Invites: list with Accept/Decline
	•	Quick actions: New Trip, Add Expense
	•	Trip:
	•	Summary tab: who owes whom (simplified), CTA to settle
	•	Expenses tab: list with payer, amount, tags (OCR), receipt thumbnail
	•	AC:
	•	Balances accurate to currency's minor unit (PHP centavos)
	•	"Simplify debts" shows minimal payment graph
	•	Real-time updates via WebSocket for expense changes

6) Payment QR codes
	•	Flow: Profile → Payment Methods → Upload QR image or paste pay link → preview + save
	•	Where shown: In Trip "Settle up" modal next to a payee
	•	AC:
	•	Validate QR/URI payload (basic sanity)
	•	Store both image (for scan) and payload (for deep link when possible)
	•	Never process actual payments server-side (out of scope); we just surface the payee's method

⸻

Debt Simplification (algorithm)
	•	Build net balance map per trip: positive = should receive; negative = should pay
	•	Greedy min-cashflow or min-edge settlement:
	1.	Pick max creditor and max debtor
	2.	Transfer min(|debtor|, creditor) from debtor→creditor
	3.	Update nets; repeat until all ~0
	•	Persist as SettlementSuggestion for UX; recalc after each expense change.

⸻

API Sketch (REST)
POST /auth/signup {username, password}
POST /auth/login {username, password}
POST /auth/logout

POST /trips {name, currency_code [default: 'PHP']}
GET  /trips
GET  /trips/:id
POST /trips/:id/invites {invitee_username}
GET  /invites           // current user
POST /invites/:id/respond {action: "accept"|"decline"}

POST /trips/:id/expenses {
  description, expense_date, items[], splits[], tax_amount, total_amount, payer_user_id
}
POST /trips/:id/expenses/ocr {file}  // returns {draft_expense, confidence}
GET  /trips/:id/expenses

GET  /trips/:id/settlements/suggestions

POST /me/payment-methods {type, label, payload_text, file?}
GET  /users/:id/payment-methods

WebSocket endpoints:
WS /ws/trips/:id - Real-time updates for trip members

⸻

Security, Privacy, and Roles
	•	Passwords: Argon2id with per-user salt; rate-limit auth endpoints; lockout on brute-force
	•	Sessions: HttpOnly, Secure; CSRF tokens on state-changing form posts
	•	AuthZ: TripOwner can invite/remove members; members can add expenses; only payer/owner can delete an expense (or allow anyone to delete their own contributions—decide)
	•	PII: Keep minimal—username & optional display_name; no phone/email required for MVP
	•	Rate limiting: All endpoints with appropriate thresholds
	•	Input sanitization: OCR text and user inputs to prevent XSS
	•	File upload security: Virus scanning, file type restrictions, size limits

⸻

OCR Implementation Notes
	•	Baseline: Tesseract (free, on worker) with OpenCV pre-processing; fast to prototype
	•	Receipt parsing: Heuristics/regex for price patterns; line grouping by XY positions; tax keywords ("VAT", "TAX", "GST", etc.)
	•	Cloud fallback (optional): Google Vision / AWS Textract for tougher receipts (env-configurable)
	•	UX: ALWAYS show the parsed draft for confirmation; let users re-crop and re-OCR if needed
	•	Failure path: Graceful degradation to manual entry with image attached
	•	Image validation: Max 5MB, jpg/png only, quality check before OCR
	•	Retry mechanism: Max 3 attempts with exponential backoff
	•	Confidence scoring: Display confidence per field, highlight low-confidence items

⸻

Mobile-first UX details
	•	Layout: bottom tab bar (Dashboard, Trips, Add, Activity, Profile)
	•	Forms: single-column, large inputs, numeric keypad for amounts, sticky Save CTA
	•	Image capture: guide overlay; compress to ~1600px max dimension
	•	Offline: Basic PWA shell (deferred to future implementation)
	•	Push notifications: For invites and settlement reminders
	•	Haptic feedback: For mobile interactions

⸻

Testing & Quality
	•	Unit: balance calculations, split math, OCR parser functions
	•	E2E (Playwright): sign up → invite → accept → add expense (OCR + manual) → verify balances
	•	Load: OCR queue under burst uploads; image size constraints enforced
	•	Security: auth flow tests, CSRF, rate limits, path traversal for file uploads
	•	OCR accuracy: Test with various receipt formats, lighting conditions, image qualities

⸻

Risk & Mitigation
	•	OCR accuracy variance: Provide fast manual fixes; confidence display; keep cloud option switchable
	•	Image bloat: Client-side compression; S3 lifecycle rules
	•	Username collisions & typos: Confirm avatar/alias before sending invite; offer copyable username on Profile
	•	Debt calc drift: Always derive from ledger; include automated regression tests for corner cases
	•	WebSocket scaling: Implement connection pooling and fallback to polling if needed

⸻

Current Implementation Status (Updated)

✅ COMPLETED FEATURES:
	1.	Dashboard shell with trip management
	2.	Simple user management (no authentication required)
	3.	Trip creation and management
	4.	User/gastador management with QR code support
	5.	Expense creation with multiple split types (equal, percentage, exact, shares)
	6.	Balance calculations and settlement suggestions
	7.	Individual balance breakdowns showing who owes whom
	8.	Modal system with consistent layout and scroll handling
	9.	Currency formatting with proper decimal precision
	10.	Trip member management (add/remove users from trips)
	11.	User profile management with QR code viewer
	12.	Responsive mobile-first design
	13.	Error handling and data type safety

🔧 RECENT FIXES (Latest Session):
	•	Fixed modal layout consistency across all modals (empty header/footer, h-[80vh])
	•	Resolved decimal precision issues in expense splitting
	•	Fixed TypeError in trip details page for expense amounts
	•	Fixed TypeError in dashboard ManageUsersModal
	•	Applied formatCurrency utility consistently across all components
	•	Updated modal system to handle scroll bar issues
	•	Made ManageUsersModal work in both dashboard and trip contexts

⸻

Near-term Backlog (remaining features)
	1.	OCR upload → draft expense flow (with mandatory user review)
	2.	Real-time updates (WebSocket) + notifications
	3.	Advanced settlement features
	4.	Polish: empty states, analytics, accessibility passes
	5.	Future: Offline support, multi-currency, advanced OCR features

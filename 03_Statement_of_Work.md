# Statement of Work (SoW)
## Vibeventz Mobile App Development

**Client:** Mohamed Bera  
**Provider:** OWD Solutions  
**Project:** Vibeventz - Multi-Vendor Event Marketplace Mobile App  
**Quote Reference:** OWD-2025-2746  
**Date:** [Insert Date]  
**Effective Date:** [Upon signature and receipt of deposit]

---

## 1. PARTIES

**CLIENT:**  
Name: Mohamed Bera  
Trading As: Vibeventz  
Email: [Insert email]  
Phone: [Insert phone]  
Address: [Insert address]  

**PROVIDER:**  
Name: OWD Solutions  
Representative: [Your name]  
Email: [Your email]  
Phone: [Your phone]  
Company Registration: [If applicable]

---

## 2. PROJECT SUMMARY

OWD Solutions will design, develop, test, and deploy a multi-vendor event marketplace mobile application for Android (Google Play) and iOS (Apple App Store) using React Native + Expo framework, based on the specifications and requirements outlined in Quote OWD-2025-2746 and clarified during the Discovery Call on [date].

**Tech Stack:**
- Frontend: React Native + Expo (TypeScript)
- Backend: Supabase (Postgres, Auth, Storage)
- Navigation: React Navigation
- State Management: React Query
- Payments: [Provider TBD - to be confirmed by Week 1]
- Notifications: Firebase Cloud Messaging (FCM) + APNs
- Analytics: Google Analytics 4 (GA4)
- Error Tracking: Sentry

---

## 3. SCOPE OF WORK

### 3.1 IN-SCOPE DELIVERABLES

#### Mobile Application Features:
1. **Authentication & User Management**
   - Email/password authentication with email verification
   - Password reset functionality
   - Multi-role system (Customer, Vendor, Admin)
   - Role-based navigation and permissions

2. **Search & Discovery**
   - Search by category, subcategory, location, date, price
   - Map view toggle
   - Advanced filters: dietary (Halaal/Kosher/Vegan), capacity, vendor/venue type
   - Location-based search with radius selector
   - Vendor profile pages with tabs: Features, Reviews, About, Calendar

3. **My Planning Module**
   - Events Diary
   - Quote Management
   - Bookings Management
   - Budget Tracker

4. **My Shortlist**
   - Save favorite vendors
   - Compare vendors side-by-side

5. **Booking System**
   - Quote Request flow
   - Instant Booking flow
   - Payment processing (deposits and full payments)
   - Booking confirmation (WhatsApp + Email notifications)

6. **Vendor Management**
   - Vendor onboarding with KYC (bank letter, ID, signed T&Cs)
   - Admin approval gate for new vendors
   - Vendor profile creation and editing
   - Two-tier plans: Free and Premium
     - **Free:** 5 photos, 1 video (≤30s), 150-word description
     - **Premium:** 20 photos, 3 videos (≤60s each), 500-word description
   - Calendar management (show next available date)

7. **Media Management**
   - Photo uploads (min 1080×1080px, max 5MB each)
   - Video uploads (up to 60s, max 50MB)
   - Image compression and optimization
   - Media moderation by admin

8. **Reviews & Ratings**
   - Star ratings with comments
   - Photo evidence support
   - Admin approval before publish
   - Display on vendor profiles

9. **In-App Messaging**
   - Customer ↔ Vendor messaging
   - Message notifications (WhatsApp + Email, no SMS)

10. **Payments & Monetization**
    - Integration with [Payment Provider TBD]
    - Support for deposits and full payments
    - Commission structure (configurable, default [X]%)
    - Funds collection to client's main bank account
    - Manual vendor payout tracking by admin (weekly default)

11. **Moderation & Safety**
    - Admin moderation queue for listings and media
    - User abuse reporting
    - Content flagging system
    - Admin triage and action tools

12. **Notifications**
    - Push notifications for bookings, messages, updates
    - WhatsApp deep link integration for support
    - Email notifications for key actions

13. **Compliance & Privacy**
    - POPIA/GDPR consent flows
    - Privacy Policy and Terms & Conditions screens
    - Data retention: dormant profiles (≥3 years) deleted, favorites until cleared, search history ~3 months
    - Right to be forgotten (delete all user data on request)

14. **Admin Console (Web-based, minimal)**
    - Vendor approval/rejection
    - Content moderation queue
    - Review approval queue
    - Manual payout recording
    - Basic user management
    - Abuse report triage

15. **Analytics & Monitoring**
    - Google Analytics 4 (GA4) integration
    - Sentry crash tracking
    - Performance monitoring

#### Operational Deliverables:
1. Apple Developer Account setup assistance
2. Google Play Console setup assistance
3. App icons, splash screens, and branding assets
4. Store listings: descriptions, screenshots, content ratings
5. Privacy Policy and Data Safety forms for both stores
6. CI/CD pipeline for automated builds
7. Release management: Internal testing → Beta (TestFlight/Closed Testing) → Production
8. Post-launch monitoring for 30 days

#### Documentation:
1. Database schema and architecture documentation
2. API documentation (Supabase Edge Functions)
3. Admin console user guide
4. Developer handover documentation (README, deployment guide)
5. Store submission checklists

---

### 3.2 OUT-OF-SCOPE (Not Included)

The following are **explicitly excluded** from this SoW and will require separate quotes:

1. **Automated vendor payouts** (manual tracking included; automation is a future phase)
2. **SMS notifications** (WhatsApp and Email only)
3. **External calendar sync** (Google Calendar, Outlook sync; in-app calendar only)
4. **Social media logins** (Google/Apple/Facebook OAuth; email/password only unless added via change order)
5. **Advanced analytics dashboards** (basic GA4 included; custom dashboards extra)
6. **In-app video/voice calling** (messaging only)
7. **Multi-language support** (English only)
8. **Web application** (mobile apps only; admin console is minimal web interface)
9. **Marketing services** (app store optimization, paid ads, social media)
10. **Content creation** (vendor recruitment, photography, copywriting beyond templates)
11. **Legal review** (templates provided; client must have lawyer review)
12. **Third-party API integrations** not listed (e.g., accounting software, CRM)
13. **Custom hardware integration** (NFC, Bluetooth beacons, etc.)
14. **Blockchain/crypto payments**
15. **AI/ML features** (recommendation algorithms beyond basic filtering)

---

## 4. PROJECT TIMELINE

**Total Duration:** 5 months from deposit receipt  
**Estimated Start Date:** [Upon 50% deposit receipt]  
**Estimated Launch Date:** [5 months from start]

### Phase 1: Discovery & Preparation (Month 1)
- Discovery call and requirements finalization
- Client account setup (Apple, Google, payment provider)
- Brand asset collection
- Firebase and Supabase setup
- Database schema design
- GitHub repository and CI/CD setup
- Legal document templates

### Phase 2: Mobile Enablement (Month 2)
- React Native + Expo project initialization
- Authentication and role-based navigation
- Device permissions and media handling
- Push notification setup
- Core app structure and navigation

### Phase 3: Feature Hardening (Month 3)
- Search and discovery features
- Vendor profiles and listings
- Booking flows (Quote + Instant Booking)
- Payment integration
- In-app messaging
- Reviews and ratings
- Admin console v1

### Phase 4: QA, Beta & Compliance (Month 4)
- Internal QA and bug fixes
- TestFlight (iOS) and Google Closed Testing (Android)
- Beta user feedback incorporation
- Store compliance (Privacy Policy, Data Safety, content ratings)
- Performance optimization
- Security audit

### Phase 5: Submission, Launch & Hypercare (Month 5)
- Store submissions (Apple App Store, Google Play)
- Review coordination and re-submissions if needed
- Staged rollout (10% → 50% → 100%)
- Launch day coordination
- Post-launch monitoring and hotfixes
- Handover and admin training

**Note:** Timeline assumes:
- Client provides required assets and account access within 5 business days of request
- Client provides feedback and approvals within 3 business days
- Apple and Google review times are standard (1-3 days Apple, <48 hours Google)
- No major third-party service outages
- No more than 2 revision rounds per milestone (additional revisions billable)

---

## 5. CLIENT RESPONSIBILITIES

The Client agrees to:

1. **Accounts & Access:**
   - Create and maintain Apple Developer Account ($99/year, paid directly by Client)
   - Create and maintain Google Play Console account ($25 one-time, paid directly by Client)
   - Provide access credentials to OWD Solutions for app submission
   - Create and maintain payment provider merchant account
   - Provide bank account details for funds collection

2. **Assets & Content:**
   - Provide logo files (SVG, PNG) within 5 business days of project start
   - Provide brand colors (HEX codes) and fonts
   - Provide WhatsApp support number (international format)
   - Provide or approve Terms & Conditions, Privacy Policy, and Vendor Agreement
   - Provide app store description copy or approve OWD-drafted copy

3. **Decisions & Approvals:**
   - Confirm payment provider selection by Week 1
   - Confirm commission percentage and vendor tier pricing by Week 2
   - Respond to deliverable reviews within 3 business days
   - Provide written sign-off at each milestone gate
   - Approve store listings before submission

4. **Testing & Feedback:**
   - Test deliverables on own devices (iOS and Android)
   - Recruit 5-10 beta testers for Month 4 testing
   - Provide structured feedback via dashboard or email (not scattered WhatsApp messages)
   - Prioritize feedback into critical vs nice-to-have

5. **Payments:**
   - Pay invoices within 5 business days of receipt
   - Notify OWD immediately if payment will be delayed

6. **Post-Launch:**
   - Monitor admin console daily for moderation tasks
   - Respond to customer support inquiries
   - Process vendor payouts weekly (default Friday)

**Failure to meet these responsibilities may result in project delays. Timeline will be adjusted accordingly, with no penalty to OWD Solutions.**

---

## 6. PAYMENT TERMS

**Total Project Cost:** R 115,000 (ZAR)  
*Includes preferred client discount for Mohamed Bera*

### Payment Schedule:
1. **50% Upfront: R 57,500**  
   Due: Upon signing this SoW  
   Triggers: Project start, infrastructure setup

2. **30% at Beta: R 34,500**  
   Due: Upon beta release to TestFlight and Google Closed Testing  
   Triggers: Phase 4 completion, store compliance ready

3. **20% at Launch: R 23,000**  
   Due: Upon app approval and public release on both stores  
   Triggers: Phase 5 completion, handover

### Payment Method:
- Bank transfer (EFT) to OWD Solutions account
- Invoice provided 5 business days before due date
- Payment reference: OWD-2025-2746-[Milestone]

### Late Payment:
- Payments overdue by 7+ days: work on next phase pauses
- Payments overdue by 14+ days: project timeline adjusted, formal notice issued
- No penalty fees, but delays impact delivery dates

### Refunds:
- 50% deposit is non-refundable once work begins
- If Client cancels mid-project: payment for work completed to date, calculated proportionally
- If OWD Solutions fails to deliver per SoW: refund of unearned portion

---

## 7. REVISIONS & CHANGE MANAGEMENT

### 7.1 Included Revisions (In-Scope)
- Up to **2 rounds of revisions per milestone** for in-scope features
- Revisions must address:
  - Clarifications of requirements
  - Bug fixes
  - Minor UX/copy adjustments
  - Alignment with approved specifications

### 7.2 Excluded Revisions (Out-of-Scope)
- New features not in original quote
- Substantial design changes after milestone sign-off
- Additional integrations or third-party services
- Rework caused by third-party policy changes (Apple/Google) beyond OWD's control
- Changes to fundamental architecture or tech stack

### 7.3 Change Order Process
1. Client requests change (email or meeting)
2. OWD provides mini-quote within 2 business days:
   - Feature description
   - Technical approach
   - Time estimate (hours/days)
   - Cost (R 900/hour or fixed fee)
   - Impact on timeline
3. Client approves in writing (email reply)
4. Payment: 100% upfront for change orders under R 10,000; 50/50 split for larger changes
5. Work begins after payment clears
6. SoW updated with amendment

### 7.4 Turnaround Times
- Minor in-scope revisions: 3-5 business days
- Larger in-scope adjustments: 5-7 business days, scheduled in next sprint
- Change orders: estimated during quoting process

---

## 8. ACCEPTANCE CRITERIA

The project is considered complete when:

1. ✅ Mobile apps build and install on current iOS (16+) and Android (11+) versions
2. ✅ All core features from Section 3.1 work as specified
3. ✅ Apps pass internal QA (no critical bugs)
4. ✅ Apps approved and published on Apple App Store and Google Play
5. ✅ Both booking modes functional: Quote requests and Instant Booking
6. ✅ Payment flow works end-to-end (test mode verified, live mode enabled)
7. ✅ Admin console accessible and functional
8. ✅ Documentation provided (database schema, admin guide, developer README)
9. ✅ Handover training completed

**Client has 5 business days after launch to report critical defects.** Defects reported during warranty period (Section 9) will be fixed at no charge.

---

## 9. WARRANTY & POST-LAUNCH SUPPORT

### 9.1 Warranty Period
**3 months of bug-fix support** after production launch

### 9.2 What's Covered (No Charge)
- Fixing defects in delivered features
- Crashes or errors caused by OWD's code
- Minor UX/copy tweaks directly tied to bug fixes
- Performance issues caused by OWD's implementation
- Security vulnerabilities in OWD's code

### 9.3 What's Not Covered (Billable)
- New features or enhancements
- Scope changes or additions
- Store or policy-driven rework (e.g., Apple changes privacy rules)
- Performance/scaling beyond initial spec (e.g., 100,000+ users)
- Third-party service issues (Supabase outage, payment provider downtime)
- Issues caused by Client modifications to code
- Training beyond initial handover session

### 9.4 Support Response Times (Warranty Period)
- **Critical** (app down, data breach): 4 hours response, 24 hours resolution target
- **High** (major feature broken): 24 hours response, 3 business days resolution target
- **Medium** (minor bug, workaround exists): 3 business days response, 1 week resolution target
- **Low** (cosmetic, enhancement request): 5 business days response, best-effort resolution

### 9.5 Post-Warranty Support
After 3-month warranty expires, Client may:
- **Option A:** Pay R 900/hour for ad-hoc fixes (1-hour minimum)
- **Option B:** Monthly retainer (R 5,000-10,000/month) for ongoing support (quote provided separately)
- **Option C:** No support (Client maintains in-house or hires another developer)

---

## 10. INTELLECTUAL PROPERTY

### 10.1 Client IP
Client retains all rights to:
- Vibeventz brand, name, logo, and trademarks
- Business processes and concepts
- Content provided (descriptions, photos, copy)
- Customer and vendor data

### 10.2 OWD Solutions IP
OWD Solutions retains rights to:
- Pre-existing code libraries and boilerplate
- Development tools and frameworks
- General methodologies and best practices
- Code written for other clients

### 10.3 Project-Specific Code
After **full and final payment**, Client owns:
- Project-specific codebase (React Native app)
- Database schema and Supabase configuration
- Admin console code
- Documentation created for this project

**License:** Client receives full, perpetual, worldwide license to use, modify, and distribute project-specific code for Vibeventz project only. Client may hire other developers to maintain code.

**OWD Solutions may:**
- Showcase project in portfolio (with Client permission)
- Reuse non-confidential techniques learned during project
- Reference Client as a client (with permission)

---

## 11. CONFIDENTIALITY

Both parties agree to:
- Keep confidential information private (business plans, financials, code, data)
- Not disclose to third parties without written consent
- Use confidential information only for this project
- Return or destroy confidential materials upon request

**Exceptions:** Information that is public, independently developed, or legally required to disclose.

---

## 12. THIRD-PARTY SERVICES & FEES

### 12.1 Client-Paid Services (Not Included in R 115,000)
- Apple Developer Program: $99/year
- Google Play Console: $25 one-time
- Supabase hosting: Free tier initially, usage-based pricing (estimate R 500-2,000/month at scale)
- Firebase: Free tier initially, usage-based pricing
- Payment provider fees: 2-4% per transaction (varies by provider)
- Domain name (if desired): R 100-500/year
- Email service (if desired): R 50-300/month
- SSL certificates (if needed beyond Supabase): R 0-1,000/year

### 12.2 Estimated Monthly Running Costs (Post-Launch)
- Supabase: R 500-2,000/month (depends on users and data)
- Firebase: R 0-500/month (depends on push notification volume)
- Payment provider: 2-4% of revenue
- App store fees: 0% (under 1M USD/year revenue)
- **Total:** ~R 1,000-3,000/month + transaction fees

**OWD Solutions is not responsible for third-party service costs, outages, or price changes.**

---

## 13. LIMITATION OF LIABILITY

### 13.1 Disclaimer
OWD Solutions provides services "as is" to the best of professional ability. We disclaim warranties of:
- Uninterrupted service
- Error-free code (we fix bugs during warranty)
- Specific revenue or user growth outcomes
- Third-party service reliability

### 13.2 Liability Cap
OWD Solutions' total liability for any claim related to this project is limited to **the total amount paid by Client** (R 115,000).

### 13.3 Consequential Damages
Neither party is liable for indirect, incidental, or consequential damages (lost profits, lost data, business interruption).

### 13.4 Client Indemnification
Client indemnifies OWD Solutions against claims arising from:
- Client's content (copyright infringement, defamation)
- Client's business practices (vendor disputes, customer complaints)
- Client's misuse of the platform
- Client's violation of laws or third-party rights

---

## 14. TERMINATION

### 14.1 Termination by Client
Client may terminate at any time with written notice. Client pays:
- All work completed to date (calculated proportionally)
- Non-refundable expenses incurred (third-party services purchased)
- Small kill fee (10% of remaining contract value, max R 10,000)

### 14.2 Termination by OWD Solutions
OWD Solutions may terminate if:
- Client fails to pay after 14 days of invoice due date
- Client fails to provide required materials after 14 days of request
- Client breaches SoW materially
- Project pauses for >30 days due to Client inaction

Upon termination by OWD Solutions:
- Client receives all work completed to date
- Refund of unearned portion of payments
- Source code access (even if incomplete)

### 14.3 Effect of Termination
- Both parties return confidential materials
- Outstanding invoices become immediately due
- IP rights transfer per Section 10 (only for paid work)
- No obligation to complete work beyond termination date

---

## 15. PROJECT PAUSE/DELAY

### 15.1 Client-Requested Pause
If Client requests pause >14 days:
- Work stops immediately
- Timeline recalculated upon restart
- No refunds for work already completed
- Restart may require re-planning fee (R 5,000-10,000)

### 15.2 Force Majeure
If project delayed due to events beyond control (natural disaster, pandemic, war, major tech platform shutdown):
- Timeline extended by delay duration
- No penalty to either party
- If delay >90 days, either party may terminate without penalty

---

## 16. DISPUTE RESOLUTION

### 16.1 Good Faith Negotiation
Parties agree to first attempt resolution via:
1. Direct conversation (call or meeting)
2. Email exchange outlining concerns
3. Mediation by neutral third party (cost split 50/50)

### 16.2 Arbitration
If negotiation fails, disputes resolved via binding arbitration in [City, Country], under [Arbitration Rules].

### 16.3 Governing Law
This SoW governed by laws of Republic of South Africa.

---

## 17. MISCELLANEOUS

### 17.1 Entire Agreement
This SoW, together with Quote OWD-2025-2746, constitutes the entire agreement. Supersedes all prior verbal or written agreements.

### 17.2 Amendments
Amendments must be in writing, signed by both parties (email signature acceptable).

### 17.3 Severability
If any provision is unenforceable, remainder remains in effect.

### 17.4 No Partnership
This SoW does not create partnership, agency, or employment relationship.

### 17.5 Assignment
Neither party may assign this SoW without written consent, except OWD Solutions may subcontract specific tasks.

### 17.6 Notices
All notices sent via email to addresses listed in Section 1. Effective upon sending.

### 17.7 Survival
Sections 10 (IP), 11 (Confidentiality), 13 (Liability), 14 (Termination effects) survive termination.

---

## 18. SIGNATURES

By signing below, both parties agree to all terms and conditions in this Statement of Work.

**CLIENT:**

Signature: ___________________________________  
Name: Mohamed Bera  
Date: ___________________________________

**PROVIDER:**

Signature: ___________________________________  
Name: [Your name]  
Title: [Your title], OWD Solutions  
Date: ___________________________________

---

## APPENDIX A: DISCOVERY CALL DECISIONS

*To be completed after discovery call and attached to this SoW*

1. **Payment Provider:** [TBD]
2. **Commission Percentage:** [TBD]%
3. **Vendor Tier Pricing:**
   - Free Tier: R [TBD]/month
   - Premium Tier: R [TBD]/month
4. **Main Categories:** [List TBD]
5. **Subcategories:** [List TBD]
6. **Event Types:** [List TBD]
7. **WhatsApp Support Number:** [TBD]
8. **Prefilled Support Message:** [TBD]
9. **Payout Schedule:** [Weekly/Bi-weekly/Monthly] on [Day of week]
10. **Review Approval Policy:** [All reviews / Only flagged reviews]
11. **Vendor Approval Turnaround:** [24-48 hours / 5 business days]
12. **Other Key Decisions:** [List as needed]

---

**Document Version:** 1.0  
**Date Prepared:** [Today's date]  
**Valid Until:** [60 days from preparation]  
**Project Start:** Upon signature and receipt of 50% deposit (R 57,500)

---

*This Statement of Work is a legally binding contract. Both parties should review carefully and consult legal counsel if needed before signing.*

# Vibeventz Project - Quick Reference Checklist
**Your Day-to-Day Command Center**

---

## 🚀 PROJECT KICKOFF (Week 0-1)

### Before Discovery Call (Tomorrow):
- [ ] Review Quote (HowzEventz_Quote.html) thoroughly
- [ ] Review 01_Discovery_Call_Questions.md
- [ ] Prepare Zoom link and test screen sharing
- [ ] Open Project_Dashboard.html (bookmark it)
- [ ] Have notebook ready for notes

### During Discovery Call:
- [ ] Record call (ask permission first)
- [ ] Take detailed notes in 01_Discovery_Call_Questions.md
- [ ] Identify decision deadlines (payment provider, categories, etc.)
- [ ] Set next meeting date
- [ ] Confirm client has budget ready (R 57,500 deposit)

### After Discovery Call (Within 24 hours):
- [ ] Send meeting summary email
- [ ] Fill out Appendix A in Statement of Work
- [ ] Send Statement of Work for signature
- [ ] Send invoice for 50% deposit (R 57,500)
- [ ] Update dashboard with Phase 1 tasks

### Before Starting Work:
- [ ] Receive signed Statement of Work
- [ ] Receive 50% deposit (R 57,500) - confirm it clears
- [ ] Update dashboard: mark payment received
- [ ] Send "Project Start" email with timeline

---

## 📋 PHASE 1 CHECKLIST (Month 1)

### Week 1: Accounts & Assets
- [ ] Client creates Apple Developer Account ($99/year)
- [ ] Client creates Google Play Console ($25 once)
- [ ] Receive Apple Developer credentials (for app submission later)
- [ ] Receive Google Play Console access
- [ ] Collect logo files (SVG, PNG)
- [ ] Collect brand colors (HEX codes)
- [ ] Collect brand fonts (or confirm using system fonts)
- [ ] Confirm payment provider (PayFast/Yoco/other)
- [ ] Help client set up merchant account
- [ ] Confirm WhatsApp support number

### Week 2: Infrastructure
- [ ] Create Firebase project (push notifications)
- [ ] Set up FCM (Android) and APNs (iOS) credentials
- [ ] Create Supabase project
- [ ] Set up Supabase Auth
- [ ] Set up Supabase Storage
- [ ] Configure Supabase RLS policies (basic)
- [ ] Create GitHub repository (private)
- [ ] Add .gitignore, README
- [ ] Set up branch structure (main, develop, feature/*)

### Week 3: Database & API
- [ ] Design database schema (tables, relationships)
- [ ] Create ERD (entity-relationship diagram)
- [ ] Implement schema in Supabase
- [ ] Create seed data for testing
- [ ] Set up Supabase Edge Functions (if needed)
- [ ] Document API endpoints
- [ ] Present schema to client for approval

### Week 4: Legal & Meeting
- [ ] Draft Terms & Conditions (template)
- [ ] Draft Privacy Policy (template)
- [ ] Draft Vendor Agreement (template)
- [ ] Send to client for lawyer review
- [ ] Update dashboard with Week 1-4 progress
- [ ] **Weekly Check-in #1:** Progress review (30 min Zoom)
- [ ] Send meeting summary

---

## ⚙️ PHASE 2 CHECKLIST (Month 2)

### Week 5: React Native Setup
- [ ] Initialize Expo project with TypeScript
- [ ] Configure folder structure (screens, components, services, etc.)
- [ ] Set up ESLint and Prettier
- [ ] Configure React Navigation (stack, tabs, drawer)
- [ ] Install key dependencies (React Query, form libraries, etc.)
- [ ] Test on iOS simulator and Android emulator
- [ ] Test on physical devices

### Week 6: Authentication
- [ ] Implement sign-up flow with email verification
- [ ] Implement login flow
- [ ] Implement password reset
- [ ] Implement role selection (customer vs vendor)
- [ ] Configure Supabase Auth
- [ ] Set up session management
- [ ] Test auth flows end-to-end

### Week 7: Permissions & Media
- [ ] Request camera permissions
- [ ] Request photo library permissions
- [ ] Implement photo picker
- [ ] Implement camera capture
- [ ] Implement video recording
- [ ] Implement media upload to Supabase Storage
- [ ] Add image compression
- [ ] Test on physical devices (iOS and Android)

### Week 8: Push Notifications & Meeting
- [ ] Configure Expo push notifications
- [ ] Set up FCM for Android
- [ ] Set up APNs for iOS
- [ ] Test push notifications on physical devices
- [ ] Implement notification handlers (deep links)
- [ ] **Send TestFlight link to client** (iOS)
- [ ] **Send APK to client** (Android)
- [ ] **Weekly Check-in #2:** Demo auth + media (30 min Zoom)
- [ ] Collect feedback, update dashboard

---

## 🎨 PHASE 3 CHECKLIST (Month 3)

### Week 9: Search & Discovery
- [ ] Build search screen with filters
- [ ] Implement category/subcategory filters
- [ ] Implement location-based search
- [ ] Add map view toggle
- [ ] Implement date, price, dietary filters
- [ ] Build vendor listing cards
- [ ] Add pagination/infinite scroll

### Week 10: Vendor Profiles
- [ ] Build vendor profile screen
- [ ] Add tabs: Features, Reviews, About, Calendar
- [ ] Display photos and videos
- [ ] Show ratings and reviews
- [ ] Add embedded map
- [ ] Implement "Contact Vendor" button
- [ ] Test with real vendor data

### Week 11: Booking Flows
- [ ] Build Quote Request flow
- [ ] Build Instant Booking flow
- [ ] Integrate payment provider
- [ ] Implement deposit option
- [ ] Implement full payment option
- [ ] Test payment flow (test mode)
- [ ] Add booking confirmation screen
- [ ] Send WhatsApp/Email confirmations

### Week 12: Messaging, Reviews & Meeting
- [ ] Build in-app messaging (customer ↔ vendor)
- [ ] Add message notifications
- [ ] Build review submission flow
- [ ] Implement star ratings and photo upload
- [ ] Build admin moderation queue
- [ ] Test end-to-end user journeys
- [ ] **Weekly Check-in #3:** Full app demo (60 min Zoom)
- [ ] Collect feedback
- [ ] Scope check: confirm alignment

---

## 🧪 PHASE 4 CHECKLIST (Month 4)

### Week 13: Internal QA
- [ ] Test all user flows (customer, vendor, admin)
- [ ] Test on multiple devices (iOS 16+, Android 11+)
- [ ] Test edge cases (no internet, slow connection)
- [ ] Test with large datasets (100+ vendors)
- [ ] Run performance profiling
- [ ] Fix all critical bugs
- [ ] Document known low-priority issues

### Week 14: Security & Performance
- [ ] Security audit (input sanitization, RLS policies)
- [ ] Test rate limiting
- [ ] Test authentication edge cases
- [ ] Optimize images and assets
- [ ] Reduce bundle size
- [ ] Add error boundaries
- [ ] Configure Sentry error tracking

### Week 15: Beta Launch
- [ ] Set up TestFlight (iOS)
- [ ] Set up Google Play Closed Testing (Android)
- [ ] Recruit 5-10 beta testers
- [ ] Send beta invites
- [ ] Create feedback form (Google Forms)
- [ ] Monitor crashes and errors daily
- [ ] Collect and triage feedback
- [ ] **Weekly Check-in #4:** Beta retrospective (30 min Zoom)
- [ ] **Request 30% payment (R 34,500)**

### Week 16: Store Compliance
- [ ] Finalize Privacy Policy and Terms
- [ ] Complete Apple App Privacy form
- [ ] Complete Google Data Safety form
- [ ] Complete content rating questionnaires (both stores)
- [ ] Create app icons (1024×1024 iOS, 512×512 Android)
- [ ] Create splash screens
- [ ] Take store screenshots (5-8 per platform)
- [ ] Write app descriptions (short + long)
- [ ] Prepare store listing preview for client approval

---

## 🚀 PHASE 5 CHECKLIST (Month 5)

### Week 17: Store Submissions
- [ ] Get client approval on store listings
- [ ] **Submit to Apple App Store (Monday morning)**
- [ ] **Submit to Google Play (same day)**
- [ ] Set up app monitoring dashboards
- [ ] Monitor submission status daily
- [ ] Respond to review questions within 24 hours
- [ ] If rejected: fix issues and resubmit immediately
- [ ] Update client on submission status daily

### Week 18: Launch & Monitoring
- [ ] Apps approved! 🎉
- [ ] Start staged rollout (10% of users)
- [ ] Monitor crashes, ratings, reviews (48 hours)
- [ ] Increase to 50% rollout
- [ ] Monitor (48 hours)
- [ ] Increase to 100% rollout
- [ ] **Apps are live publicly**
- [ ] Share store links with client
- [ ] **Weekly Check-in #5:** Launch celebration (30 min Zoom)
- [ ] **Request final 20% payment (R 23,000)**

### Week 19: Post-Launch Monitoring
- [ ] Monitor crash rates daily (keep <1%)
- [ ] Respond to store reviews within 24 hours
- [ ] Check server costs (Supabase, Firebase)
- [ ] Track user sign-ups and bookings
- [ ] Fix critical bugs within 24 hours
- [ ] Deploy hotfixes if needed
- [ ] Collect user feedback

### Week 20: Handover & Training
- [ ] **Handover meeting (60 min Zoom)**
- [ ] Train client on admin console
- [ ] Walk through vendor approval process
- [ ] Show how to moderate content
- [ ] Explain payout tracking
- [ ] Share codebase access (GitHub)
- [ ] Provide all documentation
- [ ] Discuss ongoing support options
- [ ] Set up 3-month warranty tracking

---

## 📅 RECURRING TASKS

### Daily (During Active Development):
- [ ] Commit code to GitHub (with descriptive messages)
- [ ] Update dashboard with task progress
- [ ] Check client emails and respond within 24 hours
- [ ] Monitor Slack/WhatsApp for urgent messages

### Weekly:
- [ ] **Every Monday:** 30-minute check-in Zoom call
- [ ] Send meeting summary within 24 hours
- [ ] Update project timeline if needed
- [ ] Review budget vs actual hours

### Monthly:
- [ ] Request milestone payment (if due)
- [ ] Review overall project health
- [ ] Update Statement of Work if scope changes
- [ ] Archive meeting notes and decisions

---

## 💰 PAYMENT TRACKING

### Milestone 1: 50% Deposit (R 57,500)
- [ ] Invoice sent: [date]
- [ ] Payment received: [date]
- [ ] Amount: R _______
- [ ] Status: ⬜ Pending / ⬜ Paid

### Milestone 2: 30% at Beta (R 34,500)
- [ ] Beta launched on TestFlight: [date]
- [ ] Beta launched on Google Play: [date]
- [ ] Invoice sent: [date]
- [ ] Payment received: [date]
- [ ] Amount: R _______
- [ ] Status: ⬜ Pending / ⬜ Paid

### Milestone 3: 20% at Launch (R 23,000)
- [ ] Apple App Store approved: [date]
- [ ] Google Play approved: [date]
- [ ] Invoice sent: [date]
- [ ] Payment received: [date]
- [ ] Amount: R _______
- [ ] Status: ⬜ Pending / ⬜ Paid

**Total Received: R _______**

---

## 🚨 RED FLAGS TO WATCH

### Client Red Flags:
- ⚠️ Payment delayed >7 days without explanation
- ⚠️ No response to emails for >5 days
- ⚠️ Constant scope changes without agreeing to change orders
- ⚠️ Unrealistic demands ("make it like Instagram by Friday")
- ⚠️ Disrespectful communication

**Action:** Address immediately, refer to contract, consider pausing work if severe.

### Technical Red Flags:
- ⚠️ App crashes >1% of sessions
- ⚠️ Performance issues (slow load times)
- ⚠️ Security vulnerabilities discovered
- ⚠️ Third-party service consistently failing
- ⚠️ Cannot meet store guidelines

**Action:** Prioritize fixes, communicate with client, adjust timeline if needed.

---

## 📞 COMMUNICATION TEMPLATES

### Weekly Check-in Agenda (Email Subject: "Vibeventz - Week X Check-in Agenda")
```
Hi Mohamed,

Looking forward to our check-in Monday at [time].

Agenda:
1. Demo: [What you'll show]
2. Completed: [List 3-4 key tasks done]
3. Next: [What's coming this week]
4. Blockers: [Anything you need from client]
5. Q&A

Zoom link: [link]

See you Monday!
```

### Meeting Summary (Email Subject: "Vibeventz - Week X Meeting Summary")
```
Hi Mohamed,

Thanks for the call today! Here's what we discussed:

**Decisions Made:**
- [Decision 1]
- [Decision 2]

**Action Items:**
- YOU: [Client action, due date]
- ME: [Your action, due date]

**Next Steps:**
- [What's happening next week]

**Next Meeting:** [Date and time]

Questions? Let me know!
```

### Payment Request (Email Subject: "Vibeventz - [Milestone] Payment Request")
```
Hi Mohamed,

Great news! We've reached the [MILESTONE] milestone:
✅ [Deliverable 1]
✅ [Deliverable 2]
✅ [Deliverable 3]

[Demo link or screenshot]

Per our agreement, the [X]% payment of R [AMOUNT] is now due.

Invoice attached. Please process within 5 business days.

Bank details:
[Your bank info]
Reference: OWD-2025-2746-[MILESTONE]

Thanks!
```

### Scope Change Response (Email Subject: "Re: Feature Request - [Feature Name]")
```
Hi Mohamed,

Great idea! [Feature] would definitely add value.

This falls outside our current scope (which covers [list in-scope items]).

Options:
1. Add as Change Order: I'll send a quote (estimated R [amount], [X] days)
2. Add to V2 Roadmap: We can include in post-launch updates

Let me know which you prefer!
```

---

## 🎯 SUCCESS METRICS

### Development Metrics:
- [ ] All 5 phases completed on time (±2 weeks acceptable)
- [ ] <5 critical bugs found in production
- [ ] App store ratings ≥4.0 stars in first month
- [ ] Crash rate <1%
- [ ] App loads in <3 seconds

### Business Metrics:
- [ ] All 3 payments received on time
- [ ] <5 change orders (scope well-managed)
- [ ] Client satisfaction: "Would you recommend OWD?" → Yes
- [ ] Project profitable (R 115,000 - expenses - time = positive)
- [ ] Client refers at least 1 new client

### Personal Metrics:
- [ ] Learned new skills (React Native, Supabase, etc.)
- [ ] Maintained work-life balance (not working weekends)
- [ ] Built portfolio piece
- [ ] Positive client relationship (testimonial)

---

## 🛠️ TOOLS & LINKS

### Project Management:
- **Dashboard:** file:///[path]/Project_Dashboard.html
- **This Checklist:** file:///[path]/04_Quick_Reference_Checklist.md
- **Discovery Questions:** file:///[path]/01_Discovery_Call_Questions.md
- **Execution Guide:** file:///[path]/02_Project_Execution_Guide.md
- **SoW:** file:///[path]/03_Statement_of_Work.md

### Development:
- **GitHub Repo:** [URL after creation]
- **Supabase Dashboard:** [URL after setup]
- **Firebase Console:** [URL after setup]
- **Expo Dashboard:** [URL]

### Client Access:
- **Apple Developer:** [Client's account]
- **Google Play Console:** [Client's account]
- **Payment Provider:** [Client's account]

### Communication:
- **Client Email:** [Mohamed's email]
- **Client WhatsApp:** [Number]
- **Weekly Meeting Link:** [Zoom recurring link]

---

## 📝 NOTES SECTION

### Project Start Date:
[Date deposit received]

### Key Decisions Log:
| Date | Decision | Made By | Impact |
|------|----------|---------|--------|
|      |          |         |        |

### Risks & Mitigation:
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
|      |            |        |            |

### Lessons Learned:
- Week 4: [What went well / what to improve]
- Week 8: [What went well / what to improve]
- Week 12: [What went well / what to improve]
- Week 16: [What went well / what to improve]
- Week 20: [What went well / what to improve]

---

**Last Updated:** [Today's date]  
**Next Review:** [After Phase 1]

---

**Pro Tip:** Print this checklist and tick boxes with a pen for satisfaction. Digital is great, but physical feels amazing. 🖊️✅

# Vibeventz Mobile App - Project Execution Guide
**Expert Development & Client Management Playbook**

---

## 🎯 Overview: Your Role as Enterprise Developer & Business Manager

You're building a **R 115,000 multi-vendor marketplace mobile app** for a solo entrepreneur. This is her passion project and primary income source. Your job is to:

1. **Deliver a production-ready mobile app** (Android + iOS)
2. **Manage client expectations** (she's not technical, educate gently)
3. **Protect your scope** (stick to the quote, manage scope creep)
4. **Build trust & reputation** (this could lead to referrals)
5. **Document everything** (CYA - Cover Your Assets)

---

## 📅 Project Timeline & Meeting Schedule (5 Months)

### **Month 1: Discovery & Preparation**
**Goal:** Gather requirements, set up infrastructure, secure payment

#### Week 1
- **Day 1 (Tomorrow):** Discovery Call (use 01_Discovery_Call_Questions.md)
  - Record the call with permission
  - Take detailed notes
  - Make no promises beyond the quote
  - Identify any red flags (unrealistic expectations, unclear vision)
  
- **Day 2-3:** Send Meeting Summary
  - Document all decisions made
  - List action items with owners
  - Highlight anything client must provide (accounts, assets, decisions)
  - Set clear deadline: "Need by [date] to stay on schedule"

- **Day 4-5:** Statement of Work (SoW) Preparation
  - Convert quote + discovery notes into detailed SoW
  - Include: scope, exclusions, payment schedule, acceptance criteria
  - Send for client signature
  - **No work starts without SoW signature and 50% deposit**

#### Week 2
- **Payment Chase:** If no payment, gentle reminder daily
  - "Hey! Just checking if you received the invoice. Let me know if you have questions."
  - After 7 days: "Project start date will shift by X days until deposit received."
  
- **Account Setup:** Guide client through:
  - Apple Developer Account ($99/year) - share screen walkthrough if needed
  - Google Play Console ($25 once)
  - Payment provider merchant account
  - Bank account verification

- **Asset Collection:**
  - Logo (SVG, PNG with transparency)
  - Brand colors (HEX codes)
  - Any existing design mockups
  - Store description copy (if they have it)

#### Week 3-4
- **Technical Setup:**
  - Firebase project (push notifications)
  - Supabase project (backend)
  - GitHub repository (private, invite client if they want access)
  - CI/CD pipeline
  - Development, staging, production environments

- **First Deliverable:** Database Schema & Architecture Document
  - Visual diagram of tables and relationships
  - Category/subcategory taxonomy
  - User role permissions matrix
  - Present in Zoom call, share screen, get approval

**Meeting: Week 4 Monday - Progress Review #1**
- **Format:** 30-minute Zoom
- **Agenda:**
  - Demo: Firebase/Supabase setup
  - Show: Database schema diagram
  - Review: Any decisions still pending
  - Next: Kick off mobile development
- **Send calendar invite 5 days ahead with agenda**

---

### **Month 2: Mobile Enablement**
**Goal:** Get the app running on physical devices with basic functionality

#### Week 5-6
- **Core Setup:**
  - React Native + Expo initialization
  - Navigation structure
  - Authentication flows (sign up, login, verification)
  - Role-based navigation (customer vs vendor vs admin)

- **Milestone Deliverable:** "Hello World" app with login
  - Send TestFlight link (iOS) and APK (Android)
  - Client can log in with test account
  - Show different screens for customer/vendor/admin roles

#### Week 7-8
- **Media & Permissions:**
  - Camera access
  - Photo/video uploads
  - Push notification setup
  - Device testing (ask client to test on their phone)

- **Milestone Deliverable:** Media upload demo
  - Client can take a photo in the app and upload it
  - Receives a push notification when upload completes

**Meeting: Week 8 Monday - Progress Review #2**
- **Format:** 30-minute Zoom
- **Agenda:**
  - Demo: App running on your phone (screen share or live demo)
  - Client tests: Send TestFlight link before meeting, have them test during call
  - Feedback: Collect UI/UX feedback (minor tweaks only, major changes = change order)
  - Next: Start building core features

---

### **Month 3: Feature Hardening**
**Goal:** Build all core features, integrate payments

#### Week 9-10
- **Search & Discovery:**
  - Category filters
  - Location-based search with radius
  - Map toggle view
  - Vendor profile pages

- **Milestone Deliverable:** Search & browse vendors
  - Client can search by category, location, date
  - Can view vendor profiles with photos

#### Week 11-12
- **Booking & Payments:**
  - Quote request flow
  - Instant booking flow
  - Payment provider integration (deposits + full payments)
  - Confirmation emails/WhatsApp

- **Milestone Deliverable:** End-to-end booking
  - Client can book a test vendor
  - Payment processes (use test mode)
  - Receives confirmation

**Meeting: Week 12 Monday - Mid-Project Review**
- **Format:** 60-minute Zoom (longer than usual)
- **Agenda:**
  - Full app walkthrough (all screens)
  - Client does a complete user journey: search → book → pay
  - Feedback collection (track in dashboard)
  - Scope check: "Are we aligned on what's in/out?"
  - Payment reminder: 30% due at beta (next month)

---

### **Month 4: QA, Beta & Compliance**
**Goal:** Polish, test, prepare for store submission

#### Week 13-14
- **Internal QA:**
  - Test all user flows
  - Edge case testing (what if user has no internet?)
  - Performance testing (slow devices)
  - Security audit (basic penetration testing)

- **Bug Fixing Sprint:**
  - Fix all critical bugs
  - Document known issues (low priority) for post-launch

#### Week 15
- **Beta Launch:**
  - TestFlight (iOS) - closed testing group
  - Google Play Closed Testing - 5-10 beta testers
  - Recruit testers: client's friends/family, early vendors

- **Milestone Deliverable:** Beta release
  - Send beta invites
  - Feedback form (Google Forms or Typeform)
  - Monitor crashes in real-time (Sentry)

**Meeting: Week 15 Friday - Beta Launch Retrospective**
- **Format:** 30-minute Zoom
- **Agenda:**
  - Review beta feedback
  - Prioritize fixes (critical vs nice-to-have)
  - Compliance checklist review
  - **Request 30% payment (R 34,500)** - "Beta milestone achieved, please process payment by [date]"

#### Week 16
- **Store Compliance:**
  - Privacy Policy finalized
  - Terms & Conditions finalized
  - App Privacy forms (Apple Nutrition Labels)
  - Data Safety form (Google Play)
  - Content rating questionnaires
  - Store screenshots (5-8 per platform)
  - App descriptions (short + long)
  - App icons & splash screens

---

### **Month 5: Submission & Launch**
**Goal:** Get approved and launch publicly

#### Week 17
- **Store Submissions:**
  - **Apple App Store:** Submit for review (Monday morning)
    - Review time: typically 1-3 days
    - Rejection rate: ~40% first time (normal)
    - Common rejections: privacy policy link broken, missing review instructions
  
  - **Google Play:** Submit for review (same day)
    - Review time: typically 24-48 hours
    - Rejection rate: lower than Apple

- **Prepare for Rejection:**
  - Don't panic if rejected
  - Read rejection reason carefully
  - Fix and resubmit within 24 hours
  - Update client: "Normal part of process, we'll fix and resubmit"

#### Week 18
- **Staged Rollout:**
  - Start at 10% of users (catch any critical bugs)
  - Monitor for 48 hours (crashes, ratings, reviews)
  - Increase to 50% if stable
  - Monitor for 48 hours
  - Increase to 100%

- **Milestone Deliverable:** Public launch! 🎉
  - Apps are live on both stores
  - Share store links with client
  - Prepare launch announcement assets (if client wants to market)

**Meeting: Week 18 Friday - Launch Celebration**
- **Format:** 30-minute Zoom
- **Agenda:**
  - Celebrate! This is a big milestone
  - Review launch metrics (downloads, ratings, crashes)
  - Discuss: Post-launch support plan
  - **Request final 20% payment (R 23,000)** - "Launch complete, final invoice attached"

#### Week 19-20
- **Post-Launch Monitoring:**
  - Watch for crashes (fix critical ones immediately)
  - Respond to store reviews (politely)
  - Monitor server costs (Supabase usage)
  - User feedback collection

**Meeting: Week 20 Monday - Handover & Training**
- **Format:** 60-minute Zoom (longer than usual)
- **Agenda:**
  - Admin panel training (how to moderate, approve vendors, handle payouts)
  - Codebase walkthrough (if client wants technical access)
  - Documentation review (README, deployment guide)
  - Warranty terms reminder (3 months of bug fixes)
  - Discuss: Ongoing support retainer (R 5,000-10,000/month)

---

## 🎤 Meeting Best Practices

### **Before Every Meeting:**
1. **Send agenda 2-3 days ahead** (calendar invite with bulleted agenda)
2. **Prepare demos** (test everything works before the call)
3. **Review dashboard** (know what's done, what's blocked, what's next)
4. **Anticipate questions** (client will ask "when will X be done?")

### **During Every Meeting:**
1. **Record the call** (with permission: "Mind if I record for notes?")
2. **Take notes in real-time** (share screen showing notes doc if possible)
3. **Confirm decisions verbally** ("Just to confirm, you want X not Y, correct?")
4. **Manage scope creep:**
   - Client says: "Can we add...?"
   - You say: "Great idea! That's outside the current scope, so it'll be a change order. Let me quote that for you."
5. **End with action items:**
   - Who does what by when
   - "You'll send logo by Friday, I'll send TestFlight link by Monday"

### **After Every Meeting:**
1. **Send meeting summary within 24 hours:**
   - "Thanks for the call! Here's what we discussed..."
   - Bulleted action items
   - Decisions made
   - Next meeting date/time
2. **Update dashboard** (tick off completed tasks, add new ones)
3. **Update project timeline** (if anything is delayed)

---

## 💰 Payment Management

### **Payment Schedule:**
1. **50% upfront (R 57,500)** - Before any work starts
2. **30% at beta (R 34,500)** - When beta is live on TestFlight/Google Closed Testing
3. **20% at launch (R 23,000)** - When apps are approved and live on stores

### **How to Request Payment:**
**Email Template:**
```
Subject: Vibeventz - [Milestone] Payment Request

Hi Mohamed,

Great progress! We've reached the [MILESTONE NAME] milestone:
- [List 3-4 key deliverables]
- [Link to demo/TestFlight/store listing]

Per our agreement, the next payment of R [AMOUNT] is now due.

Invoice attached. Payment details:
- Account: [Your bank details]
- Reference: OWD-2025-2746-[MILESTONE]

Please process payment within 5 business days. Next steps begin once payment clears.

Thanks!
[Your name]
```

### **If Payment is Late:**
- **Day 3:** Gentle reminder ("Just checking if you received the invoice")
- **Day 7:** Firmer reminder ("Payment was due [date]. Please confirm status.")
- **Day 10:** Work pause ("Work on next phase will pause until payment received")
- **Day 14:** Formal notice ("Project timeline will shift by X days")

**Never threaten legal action. Stay professional. Most delays are cash flow, not malice.**

---

## 🚨 Managing Scope Creep

### **The #1 Killer of Profitability = Scope Creep**

**Scenario:** Client says "Can we add social media sharing?"

**Wrong Response:** "Sure, no problem!" (Now you're working for free)

**Right Response:**
1. **Acknowledge:** "Great idea! Social sharing would be valuable."
2. **Scope check:** "That's not in the current scope. The quote covers [list what's in scope]."
3. **Offer options:**
   - **Option A:** "We can add it as a change order. I'll send a quote for R [amount] and [days] extra."
   - **Option B:** "We can add it to the v2 roadmap after launch."
4. **Document:** Send follow-up email summarizing the conversation.

### **How to Spot Scope Creep:**
- **Red flags:**
  - "Just a small change..." (it's never small)
  - "While you're at it, can you..." (no)
  - "I thought this was included..." (refer back to quote)
  - "My friend's app has..." (great for them, not in your scope)

- **Green flags (in scope):**
  - Clarifications of existing features
  - Bug fixes
  - UI polish within reason
  - 2 rounds of revisions per milestone (as per quote)

### **Change Order Process:**
1. Client requests new feature
2. You respond: "Let me scope that and send you a quote"
3. You create mini-quote:
   - Feature description
   - Technical approach
   - Time estimate (hours/days)
   - Cost (R 900/hour or fixed fee)
   - Impact on timeline
4. Client approves in writing (email)
5. You update SoW and start work

---

## 🛠️ Technical Best Practices

### **Code Quality:**
- **Write clean, commented code** (you might need to hire someone in 6 months)
- **Follow React Native best practices** (no spaghetti code)
- **Use TypeScript strictly** (no `any` types)
- **Lint & format** (ESLint, Prettier)

### **Version Control:**
- **Commit often** (at least daily)
- **Use descriptive commit messages** ("Add vendor profile photos" not "fix stuff")
- **Branch strategy:**
  - `main` = production
  - `develop` = staging
  - `feature/feature-name` = feature branches
  - Merge via Pull Requests with self-review

### **Testing:**
- **Manual testing** every feature before showing client
- **Device testing** on at least 3 devices:
  - 1 old Android (cheap device, Android 11)
  - 1 modern Android (Android 13+)
  - 1 iPhone (iOS 16+)
- **Beta testing** with 5-10 real users before launch

### **Security:**
- **Never hardcode API keys** (use environment variables)
- **Use HTTPS everywhere**
- **Implement rate limiting** (prevent abuse)
- **Sanitize user inputs** (prevent SQL injection, XSS)
- **Row-Level Security** in Supabase (vendors can't see each other's data)

### **Performance:**
- **Optimize images** (compress before upload, lazy load)
- **Paginate lists** (don't load 1000 vendors at once)
- **Cache API calls** (React Query handles this)
- **Monitor bundle size** (keep it under 25MB for app stores)

---

## 📊 Client Communication Strategy

### **Weekly Check-in (Every Monday, 30 min):**
**Purpose:** Keep client informed, catch issues early

**Agenda:**
1. **What was done last week** (show demos, not just talk)
2. **What's planned this week** (set expectations)
3. **Blockers** (anything you need from client)
4. **Questions** (client's turn to ask)

**Delivery:**
- Zoom call (video on, professional setup)
- Share screen showing dashboard
- Record call for notes
- Follow up with email summary

### **Milestone Reviews (Monthly, 60 min):**
**Purpose:** Major demos, feedback collection, payment requests

**Agenda:**
1. **Demo:** Show working features (not slides, real app)
2. **Testing:** Client tries it themselves (share TestFlight link before call)
3. **Feedback:** Collect and triage (in-scope vs out-of-scope)
4. **Next phase:** Preview what's coming next
5. **Payment:** Request next payment if milestone complete

### **Emergency Communication:**
**When to reach out immediately:**
- Critical bug discovered (app crashes on launch)
- Store rejection (need to fix and resubmit)
- Security incident (data breach, hack attempt)
- Third-party service down (Supabase outage)

**How to communicate emergencies:**
1. **WhatsApp message:** "Hi, urgent issue with [X]. Can you hop on a quick call?"
2. **Phone call:** If no response in 30 min
3. **Email:** Follow up with detailed write-up

**Never hide problems. Clients appreciate transparency.**

---

## 🎓 Educating Non-Technical Clients

### **Analogies That Work:**

**Client asks:** "Why does it take so long to build?"

**You say:** "Building an app is like building a house. The foundation (backend) takes time but isn't visible. The walls and roof (UI) come later. You can't skip foundation to save time."

---

**Client asks:** "Can't we just copy [competitor app]?"

**You say:** "We can get inspiration, but copying is illegal (copyright). Also, we don't know their tech stack. Building from scratch ensures it's optimized for your needs."

---

**Client asks:** "Why can't we add [feature]?"

**You say:** "We can! It's just not in the current scope. Think of the quote as a fixed menu at a restaurant. You can order off-menu, but it's extra."

---

**Client asks:** "Why did Apple reject the app?"

**You say:** "Apple has strict rules (like a bouncer at a club). They rejected because [reason]. This is normal—40% of apps get rejected first time. We'll fix it in 24 hours and resubmit. No extra cost, it's part of the process."

---

**Client asks:** "When will I start making money?"

**You say:** "The app launches [date]. Revenue depends on your marketing, vendor recruitment, and customer adoption. I'm building the platform; you're building the business. My job is to make sure the tech works flawlessly."

---

### **Set Realistic Expectations:**
- **Timelines shift** (Apple review can take 1 day or 7 days—unpredictable)
- **Bugs happen** (even with testing; warranty covers fixes for 3 months)
- **Marketing is separate** (app won't magically get users; client needs a launch plan)
- **V1 is MVP** (not feature-complete; v2 adds more)

---

## 🛡️ Protecting Yourself

### **Documentation is Your Shield:**

1. **Statement of Work (SoW):**
   - Get signature before work starts
   - Scope, timeline, payments, exclusions
   - "This supersedes verbal agreements"

2. **Meeting Notes:**
   - Email summary after every call
   - "Per our discussion today..."
   - Client rarely disputes written summaries

3. **Change Orders:**
   - Any scope change = written change order
   - Client signs before work starts
   - Protects you from "but I asked for this 2 weeks ago"

4. **Git Commits:**
   - Your timeline proof ("I built feature X on [date]")
   - If client says "you haven't done anything," show commit history

5. **Email Trail:**
   - CC yourself on all important emails
   - Archive in dedicated folder
   - If dispute, you have evidence

### **Red Flags to Watch:**
- **Client won't pay deposit** → Don't start work
- **Client adds features constantly** → Enforce change order process
- **Client disappears (no feedback)** → Pause work, send formal notice
- **Client threatens to "tell everyone"** → Stay calm, document, offer resolution
- **Client demands free work** → Politely refer to contract

### **If Things Go South:**
1. **Stay professional** (no emotional responses)
2. **Refer to contract** ("Per our SoW, section 4...")
3. **Offer mediation** ("Let's hop on a call and work this out")
4. **Know your limits** (some clients aren't worth the headache)
5. **Refund if necessary** (keep your reputation intact)

---

## 🚀 Post-Launch Strategy

### **First 30 Days After Launch:**
1. **Monitor daily:**
   - Crash rates (keep below 1%)
   - Store reviews (respond within 24 hours)
   - Server costs (Supabase usage)
   - User sign-ups (are people actually using it?)

2. **Quick fixes:**
   - Critical bugs get fixed within 24 hours
   - Submit hotfix updates (bypass normal sprint cycle)

3. **Collect feedback:**
   - In-app feedback form
   - Email survey to early users
   - Client's vendor feedback

### **Months 2-3 (Warranty Period):**
- Fix bugs covered by warranty (no charge)
- Respond to support tickets
- Minor UI tweaks (within reason)
- Performance optimizations

### **After Warranty (Month 4+):**
- Offer monthly retainer (R 5,000-10,000/month):
  - Bug fixes
  - Security updates
  - OS compatibility (new iOS/Android versions)
  - Minor feature additions (cap at X hours/month)
- Or: Hourly rate (R 900/hour) for ad-hoc work

### **V2 Features (Client's Wish List):**
Save these for future revenue:
- Advanced analytics dashboard
- Automated vendor payouts
- In-app chat (full messaging, not just notifications)
- Loyalty program
- Referral system
- Multi-language support
- Dark mode

**V2 Quote:** R 40,000-60,000 (depending on features)

---

## 📚 Resources & Tools

### **Project Management:**
- **Dashboard:** Project_Dashboard.html (your single source of truth)
- **Time tracking:** Toggle, Harvest, or manual spreadsheet
- **File sharing:** Google Drive folder shared with client

### **Communication:**
- **Meetings:** Zoom (record all calls)
- **Instant:** WhatsApp (for quick questions only)
- **Formal:** Email (for decisions, payments, scope changes)

### **Development:**
- **IDE:** VS Code with React Native extensions
- **Version control:** GitHub (private repo)
- **CI/CD:** GitHub Actions or Expo EAS
- **Backend:** Supabase
- **Monitoring:** Sentry (crashes), GA4 (analytics)

### **Design:**
- **UI Kit:** React Native Paper or NativeBase
- **Icons:** Lucide, Feather, or Expo icons
- **Colors:** Match client's brand colors
- **Fonts:** System fonts (San Francisco on iOS, Roboto on Android)

---

## ✅ Success Checklist

### **You know you're doing well if:**
- ✅ Client responds to emails within 24-48 hours
- ✅ Payments arrive on time
- ✅ Client asks clarifying questions (not demanding changes)
- ✅ Weekly meetings stay on schedule
- ✅ Client refers friends/colleagues
- ✅ App launches on time (or within 2 weeks of target)
- ✅ No major scope creep battles
- ✅ You're profitable (R 115,000 - expenses - your time = positive)

### **Red flags you're in trouble:**
- ❌ Client ghosts you for weeks
- ❌ Payments are always late
- ❌ Client demands free work constantly
- ❌ Scope has doubled but budget hasn't
- ❌ You're working 60+ hour weeks (underpriced)
- ❌ Client threatens negative reviews
- ❌ You dread their calls

**If 3+ red flags:** Have a serious conversation. Offer to part ways professionally if needed.

---

## 🎬 Final Words of Wisdom

**From 30 years of experience building enterprise apps:**

1. **Underpromise, overdeliver.** Say "I'll have it by Friday," deliver Wednesday.

2. **Document everything.** If it's not written, it didn't happen.

3. **Charge for changes.** Free work = no respect.

4. **Stay technical.** Don't just manage; keep coding. Clients respect builders.

5. **Build for the next developer.** Write code like you'll be hit by a bus tomorrow (morbid but effective).

6. **Educate, don't condescend.** Client ignorance is expected; rudeness is not.

7. **Protect your time.** No "quick calls" that aren't scheduled.

8. **Celebrate milestones.** Launch day? Crack a beer (or tea) and celebrate with the client.

9. **Learn from every project.** What went well? What won't you do again?

10. **Reputation > profit.** A happy client refers 3 more. An angry one costs you 10.

---

**Now go build something amazing! 🚀**

*Questions? Refer back to this guide. Stuck? Check the dashboard. Panicking? Take a breath, document the problem, and solve it methodically.*

*You've got this.*

---

**Document Version:** 1.0  
**Last Updated:** [Today's Date]  
**Next Review:** After Phase 1 completion

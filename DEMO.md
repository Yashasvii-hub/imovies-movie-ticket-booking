# 🎭 IMovies Evaluator Demonstration Script

**Project**: IMovies — Movie Ticket Booking Made Simple  
**Candidate**: Yashasvi Goswami (`Yashasvii-hub`)  
**Recommended Demo Duration**: 5–7 Minutes  

---

## Pre-Demo Checklist (1 Minute Before Presentation)
1. Start the server locally:
   ```powershell
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
3. Open Developer Tools (optional, to showcase clean REST API calls under the Network tab).

---

## Step-by-Step Evaluator Presentation Flow

### Step 1: Introduction & Architecture (1 Minute)
* **Action**: Display the **Homepage** with the featured blockbuster (*Oppenheimer* or *Interstellar*).
* **Talking Points**:
  > *"Good morning / afternoon evaluators. Today I am presenting IMovies — a full-stack movie ticketing platform designed with high resilience and modern UX. The backend is built using Node.js and Express with RESTful design principles and JWT role-based security. The frontend is built with React 18 and Vite, packaged with glassmorphism cinema design. The database layer supports both real MongoDB Atlas connection strings and a zero-config in-memory persistence fallback to guarantee 100% demo uptime under any testing environment."*

---

### Step 2: Browsing & Filtering (1 Minute)
* **Action**:
  1. Click on the Genre filter pills (*Action*, *Sci-Fi*, *Drama*).
  2. Type `Interstellar` into the search box to demonstrate instant client/server filtering.
  3. Click on a movie card (e.g., *Oppenheimer*) to open the **Movie Details Page**.
* **Talking Points**:
  > *"Users can filter movies by category or search by title, director, or cast. Clicking any film loads its full synopsis, runtime, ratings, and date-specific showtimes across partner cinema halls."*

---

### Step 3: Showtime Selection & Interactive Seat Map (1.5 Minutes)
* **Action**:
  1. Switch between the **Today** and **Tomorrow** tabs.
  2. Select an evening showtime slot (e.g. *06:15 PM IMAX 3D*).
  3. Show the **Interactive Cinema Seat Map**:
     - Point out the curved projection screen at the top (*All Eyes This Way*).
     - Point out the seat categories: Standard (Rows A–C, ₹250), Premium (Rows D–E, ₹350), and VIP Recliners (Row F, ₹500).
     - Click 2 seats (e.g. *D7* and *D8*). Notice the crimson selection glow and dynamic price calculation in the bottom bar.
* **Talking Points**:
  > *"Here you can see the auditorium seat layout. Notice the clear distinction between Standard, Premium, and VIP tiers. When a customer selects seats, our seat-locking mechanism temporarily holds those seats to prevent concurrent booking conflicts."*

---

### Step 4: One-Click Demo Auth & Simulated Payment (1.5 Minutes)
* **Action**:
  1. Click **Proceed to Checkout**.
  2. If not logged in, the **Auth Modal** opens. Click **"Sign In as Demo User"** (or use the one-click Demo User button in the top navbar).
  3. The **Simulated Payment Gateway** opens showing the complete breakdown: Subtotal + Convenience fee + 5% GST tax.
  4. Select a payment method (*UPI* or *Credit Card*).
  5. Click **"Pay & Confirm Booking"**.
  6. The animated transaction spinner runs, leading directly to the **E-Ticket Confirmation Voucher** with scannable QR code and unique reference ID (e.g. `IM-K7X9Q4L2`).
* **Talking Points**:
  > *"Authentication is powered by JSON Web Tokens with salted bcrypt password hashing. For convenience during evaluation, we've integrated one-click demo credentials. The checkout calculates taxes and simulates a PCI-DSS payment transaction, immediately issuing a verified e-ticket voucher with a unique booking reference and QR code."*

---

### Step 5: Booking History & Ticket Cancellation (1 Minute)
* **Action**:
  1. Navigate to **"My Bookings"** from the navbar.
  2. Point out the newly booked ticket with its `CONFIRMED` badge.
  3. Click **"View Ticket"** to demonstrate voucher re-inspection.
  4. Click **"Cancel Ticket"** on a booking. Confirm the cancellation prompt.
  5. Notice the badge updates immediately to `CANCELLED` and the reserved seats are instantly freed back to the cinema pool!
* **Talking Points**:
  > *"In the customer dashboard, users can review all past bookings and download tickets. When a ticket is cancelled, the backend immediately releases the seats back to available inventory."*

---

### Step 6: Admin Dashboard & Box Office KPIs (1 Minute)
* **Action**:
  1. Click **Demo Admin** (or log in as `admin@imovies.com` / `AdminPass123!`).
  2. Click **Admin Portal** in the navigation bar.
  3. Showcase the 4 KPI cards: **Total Revenue**, **Confirmed Bookings**, **Active Movies**, and **Registered Users**.
  4. Showcase the **Recent Box Office Transactions** table showing customer emails, seats, amounts, and statuses.
  5. Click **Add New Movie** to demonstrate admin movie catalog management.
* **Talking Points**:
  > *"Finally, cinema managers have access to the Admin Portal, protected by role-based authorization middleware. Administrators can track real-time revenue, manage screenings, and audit all system transactions."*

---

### Step 7: Automated Tests Verification (30 Seconds)
* **Action**: In the terminal, show the test suite output:
  ```powershell
  npm test
  ```
* **Talking Points**:
  > *"All 17 end-to-end and integration test cases run via Node's native test runner with a 100% pass rate, verifying data integrity from authentication to booking and admin RBAC."*

# InvoicePro — Professional Invoice Generator

> Create beautiful, professional invoices in seconds. Free, privacy-first, no signup required.

InvoicePro is a fully client-side invoice generator built with React and TypeScript. It lets you compose and export pixel-perfect PDF invoices directly in your browser — with zero backend, zero accounts, and zero data ever leaving your device.

---

## ✨ Features

- **3 Professional Templates** — Choose from *Classic*, *Modern*, and *Elegant* layouts to match your brand
- **Live Preview** — See your invoice update in real time as you fill in the details
- **One-Click PDF Export** — Downloads a high-fidelity PDF using `html2canvas-pro` + `jsPDF`
- **AES-256-GCM Encryption** — Invoice data is encrypted with the Web Crypto API before being written to `localStorage`; your data never leaves the browser
- **Tax & Discount Support** — Toggle VAT/tax with a configurable rate; apply percentage or fixed-amount discounts
- **Multi-Currency** — Supports USD, EUR, GBP, JPY, and NGN out of the box
- **Company Logo Upload** — Attach your logo directly to the invoice
- **Responsive & Mobile-Friendly** — Collapsible accordion UI on mobile with a full-screen preview mode
- **Dark Mode** — Respects the system's `prefers-color-scheme` preference
- **PWA Ready** — Installable as a Progressive Web App for offline use; service worker handles asset caching

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── features/
│   │   └── invoice/
│   │       ├── CompanyForm.tsx       # Sender / company details form
│   │       ├── DetailsForm.tsx       # Invoice metadata + client details
│   │       ├── InvoiceItems.tsx      # Line items management
│   │       ├── InvoicePreview.tsx    # Live preview wrapper
│   │       ├── InvoiceSummary.tsx    # Tax, discount, totals & export
│   │       ├── TemplatePicker.tsx    # Template selection UI
│   │       └── templates/
│   │           ├── ClassicTemplate.tsx
│   │           ├── ModernTemplate.tsx
│   │           └── ElegantTemplate.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   └── Input.tsx
│   └── InvoicePage.tsx               # Root page — layout, accordion, export logic
├── hooks/
│   ├── useLocalStorage.ts            # Encrypted localStorage hook
│   └── useMediaQuery.ts
├── store/
│   └── InvoiceContext.tsx            # Global invoice state (React Context)
├── types/
│   └── invoice.ts                    # TypeScript types & interfaces
├── utils/
│   ├── calculations.ts               # Subtotal, tax, discount, total helpers
│   ├── cn.ts                         # Tailwind class merging utility
│   ├── crypto.ts                     # AES-256-GCM encrypt/decrypt via Web Crypto
│   ├── formatters.ts                 # Currency formatting
│   └── pdf.ts                        # PDF generation (html2canvas-pro + jsPDF)
├── App.tsx
└── main.tsx
```

---

## 🔐 Privacy & Security

All invoice data is stored **exclusively in your browser**. There is no server, no database, and no analytics capturing your business data.

- A unique **AES-256-GCM** encryption key is generated per device and stored in `IndexedDB` (never exported or transmitted)
- Every write to `localStorage` is encrypted with this key before being persisted
- On load, data is decrypted in-memory — the plaintext is never written back to disk
- Clearing browser storage is equivalent to "deleting your account"

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| PDF Export | html2canvas-pro + jsPDF |
| Encryption | Web Crypto API (AES-256-GCM) |
| Icons | Lucide React |
| PWA | vite-plugin-pwa + Workbox |
| IDs | uuid v4 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Omo-Akeye/invoice-generator.git
cd invoice-generator

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` with Hot Module Replacement enabled.

### Production Build

```bash
npm run build
```

Output is written to the `dist/` directory and is ready to be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

### Preview Production Build Locally

```bash
npm run preview
```

---

## 📄 How to Generate an Invoice

1. **Pick a Template** — Select *Classic*, *Modern*, or *Elegant* from the Template Design section
2. **Fill in Invoice Details** — Set the invoice number, issue date, and due date
3. **Add Sender & Client Info** — Enter your company name, address, email, phone, and optionally upload a logo; then enter your client's details
4. **Add Line Items** — Add services or products with quantity and unit price; totals are calculated automatically
5. **Configure Summary** — Toggle tax (VAT), set rates, apply discounts, and choose a currency
6. **Add Notes** — Include any payment terms or additional information
7. **Download PDF** — Click the **PDF** button in the header or the **Download PDF** button in the summary panel

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

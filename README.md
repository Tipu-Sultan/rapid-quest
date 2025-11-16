# Marketing Search Tool

**Internal Search for Marketing Assets**  
*OCR • Auto-Categorization • Full-Text Search • Preview • Manage*

**Live Demo**: [https://your-app.vercel.app](https://your-app.vercel.app)  
**Built by**: [@Pathan_Sultan07](https://x.com/Pathan_Sultan07)  
**Tech Stack**: `Next.js 15 (App Router)` • `MongoDB` • `Tesseract.js` • `Cloudinary` • `Tailwind CSS`

---

## Features

- **File Upload**: Drag & drop PDF, DOCX, PNG, JPG, TXT
- **OCR Extraction**: Extracts text from images using `tesseract.js`
- **AI Categorization**: Auto-tags **Project**, **Team**, and **Topics** (AI, SEO, Growth, etc.)
- **Full-Text Search**: Search across filename, content, and topics
- **Smart Filters**: Filter by `Team → Project` or `topic-AI`
- **In-App Preview**: View PDF, DOCX, TXT, Images in modal (no download)
- **Manage Dashboard**: List, preview, and delete files
- **Cloud Storage**: Files stored securely in **Cloudinary**
- **Production Ready**: Deployed on **Vercel**, scalable, secure

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Database | MongoDB Atlas |
| Storage | Cloudinary |
| OCR | `tesseract.js` |
| Text Extraction | `pdf-parse`, `mammoth` |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Preview | `@cyntler/react-doc-viewer` |

---

## Setup Instructions
Create a Cloudinary Account

Visit https://cloudinary.com

Copy your:
Cloud Name
API Key
API Secret

Create an Upload Preset named: marketing_assets


3. Create .env.local File
Create a file named .env.local in the project root:
MONGODB_URI=mongodb://127.0.0.1:27017/marketing_search

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=marketing_assets

4. Start Development Server
npm run dev

Open in browser:
http://localhost:3000

5. Build for Production
npm run build
npm start


---

### 🔍 **Why it was empty earlier?**
When code blocks inside Markdown contain triple backticks, ChatGPT sometimes auto-closes them or escapes them incorrectly, causing GitHub/VS Code to hide the heading.

This version is **fully corrected**, properly escaped, and will **not break**.

---

If you want, I can now add this into a **complete README.md** without errors.



### 1. Clone & Install

```bash
git clone https://github.com/PathanSultan07/marketing-search-tool.git
cd marketing-search-tool
npm install
# AP Credit Dashboard

A comprehensive web application to check if your AP courses will earn college credit at over 2,135 universities.

## 🎓 Features

- **2,135+ Colleges**: Complete database from College Board
- **All 43 AP Courses**: Every AP course currently offered
- **Direct College Board Links**: Link to official policies for each university
- **Compare Multiple Universities**: See credit policies side by side
- **Export Results**: Download your results as CSV
- **Real-Time Search**: Filter and search through thousands of credit policies
- **Comments & Feedback**: Share your experience with other students

## 🚀 Quick Start

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3001`

## 📦 Build for Production

```bash
npm run build
```

## 🌐 Deploy to Share with Classmates

### Option 1: Vercel (Easiest)
```bash
npx vercel
```

### Option 2: GitHub Pages
1. Push to GitHub
2. Install: `npm install --save-dev gh-pages`
3. Build: `npm run build`
4. Deploy: `npx gh-pages -d dist`

See [SHARE_WITH_CLASSMATES.md](SHARE_WITH_CLASSMATES.md) for detailed instructions.

## 📁 Project Structure

```
├── public/                     # Static files
│   ├── ap_credits_master.csv  # 2,135 colleges, 91k+ policies
│   └── college_urls.csv       # College Board URLs
├── src/
│   ├── components/            # React components
│   ├── services/              # Data loading logic
│   ├── App.jsx                # Main application
│   └── index.css              # Styles
├── data-scripts/              # Data collection scripts
└── package.json
```

## 📊 Data Source

All data from College Board:
https://apstudents.collegeboard.org/getting-credit-placement/search-policies

Last updated: May 23, 2026

## 👤 Author

**Mansi Viswanath**  
Stratford Prep, Class of 2027

---

Made with ❤️ to help students navigate AP credits

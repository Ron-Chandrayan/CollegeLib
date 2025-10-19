# 🤝 Contributing to LibMan

First off, thank you for considering contributing to **LibMan**! It's people like you that make LibMan a powerful tool for modern library management.

> **LibMan** is an open-source project by **EthicCode Technologies** in collaboration with **Chandrayan Paul**.  
> We welcome contributions from developers, designers, and library management enthusiasts alike.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Key Technologies & Patterns](#key-technologies--patterns)
- [Project-Specific Guidelines](#project-specific-guidelines)
- [Common Development Tasks](#common-development-tasks)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Testing Guidelines](#testing-guidelines)
- [Troubleshooting](#troubleshooting)
- [Community & Support](#community--support)
- [Deployment](#deployment)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and collaborative environment. We expect all contributors to:

- Be respectful and considerate in communication
- Accept constructive criticism gracefully
- Focus on what's best for the project and community
- Show empathy towards other contributors

Unacceptable behavior includes harassment, trolling, or any form of discrimination. Violations may result in removal from the project.

---

## 🎯 How Can I Contribute?

There are many ways to contribute to LibMan:

### 1. **Report Bugs**
Found a bug? Please open an issue with detailed reproduction steps.

### 2. **Suggest Features**
Have an idea to improve LibMan? We'd love to hear it! Open a feature request.

### 3. **Improve Documentation**
Help us make LibMan easier to understand by improving docs, adding examples, or fixing typos.

### 4. **Write Code**
Fix bugs, implement features, or improve performance. Check our [issues](../../issues) for open tasks.

### 5. **Design & UX**
Improve the dashboard UI/UX, create mockups, or enhance accessibility.

### 6. **Test & QA**
Test new features, report edge cases, or help with automated testing.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or Atlas connection)
- **Python 3.8+** (for automation layer)
- **Git**

### Fork & Clone

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CollegeLib.git
   cd CollegeLib
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Ron-Chandrayan/CollegeLib.git
   ```

---

## 🛠️ Development Setup

### 1️⃣ Backend Setup (Node.js)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables in .env:
# - MongoDB connection string
# - JWT secret
# - Port configuration
# - Koha credentials (for testing)

# Start development server
npm run dev
```

### 2️⃣ Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd LibraryManage

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 3️⃣ Python Scripts (Data Management)

The Python scripts are located in the `backend/` directory and handle student data imports and MongoDB migrations.

```bash
# Install Python dependencies (from backend directory)
cd backend

# Install required packages
pip install pymongo python-dotenv pandas

# Or create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install pymongo python-dotenv pandas

# Python scripts available:
# - add_students.py: Import student data from CSV
# - find_student.py: Search for students in database
# - mongo_migration.py: Database migration utilities
```

### 4️⃣ Database & Environment Setup

1. **Copy environment file** in backend directory:
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Configure `.env` file** with:
   - **MongoDB URI**: Your MongoDB Atlas connection string or local MongoDB
   - **Firebase Admin SDK**: Project ID, client email, and private key
   - **AWS S3** (if using file uploads): Bucket name and credentials
   
3. **Example `.env` structure**:
   ```
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/libman?retryWrites=true&w=majority
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   ```

4. **Database Collections**: The app uses these main collections:
   - `fe_students` - Student information
   - `members` - Library members
   - `users` - User accounts
   - `dailyfootfall`, `hourlyfootfall`, `totalfootfall` - Analytics
   - `livefeed`, `activemembers` - Real-time tracking
   - `timerlogs`, `timetables` - Timer and schedule data

### 5️⃣ Running the Application

**Development Mode** (recommended):

```bash
# Terminal 1: Run backend
cd backend
npm run dev

# Terminal 2: Run frontend
cd LibraryManage
npm run dev

# Terminal 3 (Optional): Run members watcher
cd backend
npm run watch:members
```

**Production Build**:

```bash
# Build frontend
cd LibraryManage
npm run build

# Start backend (serves static frontend from dist/)
cd backend
npm start
```

The frontend will be available at `http://localhost:5173` (dev) and backend API at `http://localhost:3000` (or your configured port).

---

## 📁 Project Structure

```
CollegeLib/
├── backend/                      # Node.js + Express backend
│   ├── config/                  # Configuration files
│   │   └── apiKey.js            # API key management
│   ├── models/                  # MongoDB Mongoose schemas
│   │   ├── Users.js             # User authentication model
│   │   ├── members.js           # Library members
│   │   ├── FeStudent.js         # Student records
│   │   ├── dailyfootfall.js     # Daily analytics
│   │   ├── hourlyfootfall.js    # Hourly analytics
│   │   ├── livefeed.js          # Real-time feed
│   │   ├── ActiveMember.js      # Active members tracking
│   │   ├── timerlog.js          # Study timer logs
│   │   └── ... (other models)
│   ├── routes/                  # API route definitions
│   │   └── libraryAttendanceRoutes.js
│   ├── middleware/              # Express middleware
│   │   └── authMiddleware.js    # JWT authentication
│   ├── services/                # Business logic layer
│   │   ├── libraryAttendanceService.js
│   │   └── emailService.js      # Email notifications
│   ├── src/                     # Source utilities
│   │   ├── membersWatcher.mjs   # Members sync watcher (ES modules)
│   │   └── membersWatcher.cjs   # Members sync watcher (CommonJS)
│   ├── grads/                   # Student data CSVs
│   │   ├── 2025_grads.csv
│   │   └── faculties.csv
│   ├── uploads/                 # File uploads (question papers)
│   ├── add_students.py          # Python: Import students from CSV
│   ├── find_student.py          # Python: Search student records
│   ├── mongo_migration.py       # Python: Database migrations
│   ├── s3Config.js              # AWS S3 configuration
│   ├── s3Utils.js               # S3 upload utilities
│   ├── index.js                 # Main server entry point
│   ├── env.example              # Environment variables template
│   └── package.json             # Backend dependencies
│
├── LibraryManage/               # React + Vite frontend
│   ├── public/                  # Static assets
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.ico
│   │   ├── logo-512.png
│   │   └── manifest.json        # PWA manifest
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Auth/            # Authentication components
│   │   │   ├── Library/         # Library tracking UI
│   │   │   ├── Stats/           # Analytics & statistics
│   │   │   ├── Student/         # Student management
│   │   │   ├── Books/           # Book search & management
│   │   │   ├── Timer/           # Focus timer feature
│   │   │   ├── Barcharts/       # Data visualizations
│   │   │   ├── Linegraph/       # Graph components
│   │   │   └── ... (30+ components)
│   │   ├── utils/               # Utility functions
│   │   │   └── apiConfig.js     # API endpoint configuration
│   │   ├── assets/              # Images and static files
│   │   ├── App.jsx              # Main App component
│   │   ├── Layout.jsx           # Layout wrapper
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── eslint.config.js         # ESLint rules
│   └── package.json             # Frontend dependencies
│
├── CONTRIBUTING.md              # This file
├── package.json                 # Root package (Heroku deployment)
└── Procfile                     # Heroku deployment config
```

---

## 💻 Coding Standards

### JavaScript/React Guidelines

- **ES6+ syntax** preferred
- Use **functional components** with hooks (not class components)
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for code formatting
- Component names should be **PascalCase**
- File names should match component names
- Use **camelCase** for variables and functions

**Example:**
```jsx
// ✅ Good
const LibraryDashboard = ({ userData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return <div className="dashboard">...</div>;
};

// ❌ Avoid
class LibraryDashboard extends React.Component { ... }
```

### Node.js Backend Guidelines

- Use **async/await** for asynchronous operations
- Proper error handling with try-catch blocks
- Use **middleware** for reusable logic
- Follow RESTful API conventions
- Validate all inputs
- Add meaningful comments for complex logic

### Python Guidelines

- Follow **PEP 8** style guide
- Use **type hints** where applicable
- Handle exceptions gracefully (especially for database operations)
- Add comprehensive docstrings to functions and classes
- Use **PyMongo** for MongoDB operations
- Use **pandas** for CSV data processing
- Configure logging for better debugging
- Load environment variables with `python-dotenv`

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Keep custom CSS minimal
- Follow mobile-first approach
- Ensure accessibility (WCAG AA standards)

---

## 🔧 Key Technologies & Patterns

### Frontend Stack
- **React 19** with functional components and hooks
- **Vite** for fast development and optimized builds
- **React Router DOM** for client-side routing
- **Recharts** for data visualizations
- **Lucide React** for icons
- **React Toastify** for notifications
- **PWA** support with Vite Plugin PWA and Workbox

### Backend Stack
- **Express.js 5** for REST API
- **Mongoose** for MongoDB ODM
- **Firebase Admin** for authentication
- **JWT** for token-based auth
- **Cheerio** for web scraping (Koha integration)
- **AWS SDK** for S3 file uploads
- **Node-cron** for scheduled tasks
- **Nodemailer** for email notifications
- **Multer** for file upload handling

### Authentication Flow
- Firebase Admin SDK validates user tokens
- JWT tokens for API authentication
- Auth middleware protects routes
- Role-based access control

### Real-Time Features
- Members watcher service syncs data periodically
- Live feed updates for library activity
- Hourly footfall tracking with cron jobs

---

## 📋 Project-Specific Guidelines

### Working with Library Footfall Data

**Important Collections:**
- `dailyfootfall` - Aggregated daily statistics
- `hourlyfootfall` - Hour-by-hour tracking
- `totalfootfall` - All-time totals
- `livefeed` - Current active sessions
- `activemembers` - Currently in library

**Data Flow:**
1. Student enters/exits → API call
2. Backend updates MongoDB collections
3. Cron jobs aggregate hourly/daily stats
4. Frontend fetches and displays in Recharts

### Members Watcher Service

The `membersWatcher` service syncs external member data:
- Located in `backend/src/`
- Available in both ES Modules (.mjs) and CommonJS (.cjs)
- Run with: `npm run watch:members`
- Monitors changes and updates database

### File Upload System (Question Papers)

- Files stored in AWS S3
- Configuration in `s3Config.js` and `s3Utils.js`
- Local uploads folder structure: `uploads/qps/sem{n}/{subject}/{year}/`
- Multer handles multipart/form-data
- File metadata stored in MongoDB

### Working with Student Data

**CSV Import Flow:**
1. Place CSV in `backend/grads/`
2. Run `python add_students.py`
3. Script validates and imports to `fe_students` collection
4. Handles duplicates and errors gracefully

**Student Model:**
- Roll numbers are unique identifiers
- Branch and year information
- Active/inactive status
- Linked to library member records

### SIES GST Integration

This project is specifically built for **SIES Graduate School of Technology**:
- Student data follows SIES roll number format
- Integration with OurLib (Koha LMS) system
- Faculty and graduate data management
- SIES-specific branding and assets

### PWA Features

- Manifest file: `LibraryManage/public/manifest.json`
- Service worker auto-generated by Vite PWA plugin
- Offline support for core features
- App installable on mobile devices

### Security Considerations

**Sensitive Data:**
- Never commit `.env` files
- Use `env.example` as template only
- Firebase private keys should remain server-side only
- AWS credentials must be environment variables
- Student personal data is protected

**API Security:**
- All write operations require authentication
- Rate limiting on sensitive endpoints
- Input validation on all user data
- CORS configured for specific origins

---

## 🛠️ Common Development Tasks

### Adding a New Model

1. Create model file in `backend/models/` (e.g., `NewModel.js`)
2. Define Mongoose schema with appropriate fields and validation
3. Export the model
4. Import and use in your routes/services

### Adding a New API Endpoint

1. Define route in `backend/routes/` or `backend/index.js`
2. Create service logic in `backend/services/` (if complex)
3. Add authentication middleware if needed
4. Test endpoint with Postman or similar tool

### Adding a New React Component

1. Create component directory in `LibraryManage/src/components/`
2. Create `ComponentName.jsx` file
3. Use functional component with hooks
4. Import and use in parent component or routes
5. Style with Tailwind CSS classes

### Working with Student Data

```bash
# Import students from CSV
cd backend
python add_students.py

# Search for a specific student
python find_student.py

# Run database migration
python mongo_migration.py
```

### Testing API Endpoints Locally

Frontend dev server proxies API calls:
- `/api/*` → Production API (libman.ethiccode.in)
- `/altapi/*` → Alternative API (Heroku)

To test local backend, update `vite.config.js` proxy settings.

### Linting

```bash
# Frontend linting
cd LibraryManage
npm run lint

# Auto-fix linting issues
npm run lint --fix
```

---

## 📝 Commit Message Guidelines

We follow the **Conventional Commits** specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(library): add hourly footfall analytics

Implemented Recharts visualization for hourly library footfall
tracking with real-time data updates from MongoDB.

Closes #42
```

```bash
fix(auth): resolve Firebase token validation issue

Fixed Firebase Admin SDK token verification for new users.
Added better error handling for expired tokens.

Fixes #38
```

```bash
feat(timer): add focus timer component

Created study timer component with start/pause/reset functionality.
Integrated with backend timerlog model for session tracking.

Closes #56
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Create a new branch** for your feature:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test thoroughly**:
   - Test in development environment
   - Check browser console for errors
   - Test API endpoints with Postman/Thunder Client
   - Verify database changes in MongoDB Compass/Atlas
   - Test on mobile viewport for responsive design

4. **Update documentation** if needed

5. **Commit your changes** following commit guidelines

6. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```

### Submitting the PR

1. Go to the original repository on GitHub
2. Click **"New Pull Request"**
3. Select your branch
4. Fill out the PR template with:
   - **Description**: What does this PR do?
   - **Related Issue**: Link to issue (e.g., "Fixes #42")
   - **Type of Change**: Bug fix, feature, docs, etc.
   - **Testing**: How was this tested?
   - **Screenshots**: If UI changes

### PR Review Process

- A maintainer will review your PR within **48-72 hours**
- Address any requested changes
- Once approved, your PR will be merged
- Your contribution will be credited in release notes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested in development environment
- [ ] Related issue linked

---

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check existing [issues](../../issues) to avoid duplicates
- Collect information about the bug
- Test in the latest version

### How to Submit a Bug Report

Create an issue with the following information:

**Template:**
```markdown
**Bug Description**
Clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Screenshots**
If applicable.

**Environment:**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 16.13]
- MongoDB version: [e.g., 5.0]

**Additional Context**
Any other relevant information.
```

---

## 💡 Suggesting Enhancements

We love new ideas! To suggest an enhancement:

### Create a Feature Request

**Template:**
```markdown
**Feature Description**
Clear description of the feature.

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Mockups, examples, or references.
```

### Enhancement Categories

- **Frontend**: UI/UX improvements, new visualizations, responsive design
- **Backend**: API enhancements, performance optimizations, new endpoints
- **Library Management**: Footfall tracking, member management features
- **Analytics**: New metrics, reports, or data visualizations
- **Student Data**: Student management, CSV import improvements
- **Authentication**: Firebase/JWT improvements, role management
- **File Management**: S3 uploads, question paper management
- **Timer**: Study timer features and improvements
- **Books**: Book search and management features
- **Security**: Security enhancements, data privacy
- **DevOps**: Deployment, CI/CD, monitoring
- **Documentation**: Code documentation, user guides, API docs

---

## 🌟 Recognition

Contributors will be recognized in:

- **README.md** Contributors section
- **Release notes** for their contributions
- **GitHub Insights** Contributors page

---

## 🧪 Testing Guidelines

### Manual Testing (Current Approach)

**Frontend Testing**:
- Test all user interactions manually
- Verify responsive design on different screen sizes
- Check browser console for errors/warnings
- Test navigation and routing
- Verify data displays correctly in charts and tables
- Test authentication flow (login, logout, token refresh)

**Backend Testing**:
- Use Postman or Thunder Client for API testing
- Test all CRUD operations
- Verify authentication middleware works correctly
- Check database updates in MongoDB Compass/Atlas
- Test file upload functionality (S3)
- Verify email notifications work

**Integration Testing**:
- Test complete user workflows (e.g., student entry → database update → stats display)
- Verify members watcher sync works correctly
- Test cron jobs for footfall tracking
- Check data consistency between collections
- Test error scenarios (network failures, invalid data, etc.)

### Automated Testing (Future)
- Consider adding Jest + React Testing Library for frontend
- Consider adding Mocha/Jest for backend API tests
- Consider E2E tests with Playwright or Cypress

---

## 🔍 Troubleshooting

### Common Issues

**Frontend won't start:**
- Check if port 5173 is already in use
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

**Backend connection errors:**
- Verify MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check if backend is running on correct port
- Verify Firebase credentials are correctly formatted

**API calls failing:**
- Check Vite proxy configuration in `vite.config.js`
- Verify API endpoints match backend routes
- Check browser console for CORS errors
- Ensure authentication token is valid

**Python scripts not working:**
- Verify Python version (3.8+)
- Check if all packages are installed: `pip list`
- Verify `.env` file exists in backend directory
- Check MongoDB connection from Python script

**Build fails:**
- Clear dist folder: `rm -rf dist`
- Check for TypeScript/ESLint errors
- Verify all dependencies are installed
- Check Node.js version compatibility

**Database issues:**
- Verify collection names match model definitions
- Check MongoDB Atlas connection limits
- Ensure proper indexes exist
- Verify data types match schema

### Getting Help

If you're stuck:
1. Check existing GitHub Issues
2. Review documentation and README
3. Ask in GitHub Discussions
4. Contact maintainers (see below)

---

## 📞 Community & Support

### Get in Touch

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussions
- **Email**: Contact maintainers for private inquiries

### Maintainers

- **Atharva Chauhan** ([@TAGISWILD](https://github.com/TAGISWILD)) - System Architecture, Backend, Database.
- **Chandrayan Paul** ([@Ron](https://github.com/Ron-Chandrayan)) - Frontend, UI/UX, React Components, Backend, Database.

### Response Time
- We aim to respond to issues within **48-72 hours**
- Critical bugs are prioritized
- Feature requests are reviewed weekly

---

## 🚀 Deployment

LibMan uses a **Heroku-based deployment** setup with the following configuration:

### Deployment Structure

The root `package.json` contains Heroku-specific scripts:
- `start`: Runs the backend server
- `heroku-postbuild`: Builds the frontend and copies to `dist/`

### Heroku Configuration

**Procfile:**
```
web: node backend/index.js
```

**Environment Variables:**
Set these in Heroku dashboard or CLI:
- `MONGO_URI` - MongoDB Atlas connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- AWS S3 credentials (if using file uploads)

### Deployment Process

1. **Automated Deployment** (if configured):
   - Push to main branch triggers auto-deployment
   - Heroku runs `heroku-postbuild`
   - Frontend built and backend serves static files

2. **Manual Deployment**:
   ```bash
   # Login to Heroku
   heroku login
   
   # Add Heroku remote (if not exists)
   heroku git:remote -a your-app-name
   
   # Deploy
   git push heroku main
   
   # Check logs
   heroku logs --tail
   ```

3. **Pre-deployment Checklist**:
   - [ ] Test locally with production build
   - [ ] Update environment variables on Heroku
   - [ ] Verify MongoDB Atlas IP whitelist includes Heroku IPs
   - [ ] Check Firebase credentials are correct
   - [ ] Test API endpoints after deployment
   - [ ] Verify static files are served correctly

### Production URLs

- **API**: `https://library-sies-92fbc1e81669.herokuapp.com`

### Monitoring

After deployment:
- Check Heroku metrics dashboard
- Monitor application logs: `heroku logs --tail`
- Test all critical endpoints
- Verify database connections
- Check error tracking (if configured)

---

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for being part of the LibMan community!

> "Real-time insight. Real-world efficiency."  
> — *LibMan*

---

## 📄 License

By contributing to LibMan, you agree that your contributions will be licensed under the **MIT License**.


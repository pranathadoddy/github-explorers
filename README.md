# GitHub Explorer 🚀

A modern, responsive React application that allows users to search for GitHub users and explore their repositories. Built with TypeScript, Tailwind CSS, and comprehensive testing.

## 🌐 Live Demo

**[View Live Application →](https://pranathadoddy.github.io/github-explorers)**


## ✨ Features

- **🔍 User Search**: Search for up to 5 GitHub users with autocomplete dropdown
- **📊 Repository Display**: View all repositories for selected users with detailed information
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **⚡ Real-time Search**: Debounced search with loading states
- **🎨 Modern UI**: Clean interface with Tailwind CSS styling
- **🔗 External Links**: Direct links to GitHub profiles and repositories
- **⚠️ Error Handling**: Comprehensive error handling and user feedback
- **♿ Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full type coverage
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable icons

### Development Tools
- **Create React App** - Zero-configuration React development environment
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

### Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **@testing-library/user-event** - Advanced user interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing

### Deployment
- **GitHub Pages** - Static site hosting
- **gh-pages** - Automated deployment tool

### API
- **GitHub REST API v3** - Fetching user and repository data
- **Fetch API** - Modern HTTP client for API requests

## 📦 Installation

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git**

### Clone the Repository
```bash
# Clone the repository
git clone https://github.com/pranathadoddy/github-explorers.git

# Navigate to project directory
cd github-explorers

# Install dependencies
npm install
```

### Environment Setup
No environment variables are required as the app uses the public GitHub API.

## 🚀 Running the Application

### Development Mode
```bash
# Start the development server
npm start

# The app will open at http://localhost:3000
# The page will reload automatically when you make changes
```

### Production Build
```bash
# Create optimized production build
npm run build

# Serve the production build locally (optional)
npx serve -s build
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (default)
npm test

# Run tests once and exit
npm test -- --watchAll=false
```

### Test Coverage
```bash
# Generate test coverage report
npm run test:coverage

# View coverage report in browser
open coverage/lcov-report/index.html
```

### Test Structure
```
src/
├── __tests__/
│   ├── App.test.tsx                 # Main app integration tests
│   ├── components/                  # Component unit tests
│   │   ├── RepositoryCard.test.tsx
│   │   ├── UserProfile.test.tsx
│   │   ├── SearchInput.test.tsx
│   │   └── UserDropdown.test.tsx
│   ├── services/                    # Service layer tests
│   │   └── GitHubService.test.tsx
│   └── utils/                       # Utility function tests
│       └── formatDate.test.tsx
```

### Testing Features
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Full user workflow testing
- **API Mocking**: Service layer testing with mocked responses
- **User Interaction**: Realistic user event simulation
- **Error Handling**: Testing error states and recovery
- **Coverage Goals**: 80%+ coverage across all metrics

## 📁 Project Structure

```
github-explorers/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/              # React components
│   │   ├── Header.tsx
│   │   ├── SearchInput.tsx
│   │   ├── UserDropdown.tsx
│   │   ├── UserProfile.tsx
│   │   ├── RepositoryCard.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── services/               # API service layer
│   │   └── GitHubService.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── github.ts
│   ├── utils/                  # Utility functions
│   │   └── formatDate.ts
│   ├── __tests__/              # Test files
│   ├── App.tsx                 # Main application component
│   ├── index.tsx               # Application entry point
│   ├── index.css               # Global styles
│   └── setupTests.ts           # Test configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run eject` | Eject from Create React App (⚠️ irreversible) |

## 🌐 API Integration

### GitHub REST API v3
The application integrates with GitHub's public API:

- **Search Users**: `GET /search/users?q={query}&per_page=5`
- **Get User Repositories**: `GET /users/{username}/repos?sort=updated&per_page=100`

### Rate Limiting
- **Unauthenticated requests**: 60 requests per hour per IP
- **Search API**: 10 requests per minute per IP
- The app handles rate limiting gracefully with error messages

### No Authentication Required
The app uses public GitHub API endpoints that don't require authentication.

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure tests pass**: `npm test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use semantic commit messages
- Add tests for new components and features
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Pranatha Doddy**
- GitHub: [@pranathadoddy](https://github.com/pranathadoddy)
- Repository: [github-explorers](https://github.com/pranathadoddy/github-explorers)

## 🙏 Acknowledgments

- **GitHub API** - For providing the data
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **Create React App** - For the development setup

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: Fast initial load with progressive enhancement
- **Mobile Performance**: Optimized for mobile devices

## 🔮 Future Enhancements

- [ ] Repository filtering and sorting options
- [ ] User profile details (followers, following, bio)
- [ ] Repository statistics and charts
- [ ] Dark mode support
- [ ] Bookmark favorite users
- [ ] Repository search within user's repos
- [ ] GitHub authentication for higher rate limits

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

**🐛 Found a bug or have a suggestion? [Open an issue](https://github.com/pranathadoddy/github-explorers/issues)**
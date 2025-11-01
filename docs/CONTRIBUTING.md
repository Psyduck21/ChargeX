# Contributing to ChargeX

Thank you for your interest in contributing to ChargeX! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Python 3.12+
- Node.js 18+
- Git
- A Supabase account
- Basic knowledge of React and FastAPI

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/ChargeX.git
   cd ChargeX
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/ChargeX.git
   ```

## Development Setup

Follow the [Setup Guide](SETUP.md) to get your development environment running.

### Quick Setup

```bash
# Backend setup
cd backend
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug Fixes**: Fix existing issues
- **Feature Additions**: Add new functionality
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve tests
- **Performance**: Optimize existing code
- **UI/UX**: Improve user interface and experience

### Before You Start

1. Check existing issues and pull requests
2. Discuss major changes in an issue first
3. Ensure your changes align with the project goals
4. Follow the established code style and patterns

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing patterns and conventions
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd ../frontend
npm test

# Manual testing
# Start both servers and test functionality
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots for UI changes
- Testing instructions

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: OS, browser, Node.js version, Python version
4. **Screenshots**: If applicable
5. **Error Messages**: Full error messages and stack traces

### Feature Requests

For feature requests, include:

1. **Problem Description**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Any other relevant information

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/user-authentication`
- `fix/booking-validation`
- `docs/api-documentation`
- `refactor/database-queries`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(auth): add password reset functionality
fix(bookings): resolve timezone handling issue
docs(api): update authentication endpoints
```

### Code Review Process

1. **Self Review**: Review your own code before submitting
2. **Automated Checks**: Ensure all CI checks pass
3. **Peer Review**: Address reviewer feedback
4. **Testing**: Verify changes work as expected
5. **Documentation**: Update relevant documentation

## Code Style

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where possible
- Maximum line length: 88 characters (Black formatter)
- Use meaningful variable and function names

```python
# Good
def create_booking(booking_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Create a new booking for a user."""
    try:
        response = supabase.table("bookings").insert(booking_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating booking: {e}")
        return None

# Bad
def cb(d):
    try:
        r = supabase.table("bookings").insert(d).execute()
        return r.data
    except:
        return None
```

### JavaScript/React (Frontend)

- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful component and variable names
- Follow React best practices

```javascript
// Good
const AdminDashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stations/');
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {loading ? <LoadingSpinner /> : <StationsList stations={stations} />}
    </div>
  );
};

// Bad
const AD = () => {
  const [s, setS] = useState([]);
  const [l, setL] = useState(true);
  // ...
};
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic class names for custom components

```css
/* Good */
.booking-card {
  @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow;
}

/* Bad */
.bc {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}
```

## Testing

### Backend Testing

```bash
cd backend
python -m pytest tests/
```

Write tests for:
- API endpoints
- Database operations
- Authentication logic
- Business logic functions

### Frontend Testing

```bash
cd frontend
npm test
```

Write tests for:
- Component rendering
- User interactions
- API integration
- Error handling

### Test Coverage

Aim for:
- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ code coverage
- **Critical paths**: 100% coverage

## Documentation

### Code Documentation

- Write clear docstrings for functions and classes
- Use type hints in Python
- Add comments for complex logic
- Keep README files updated

### API Documentation

- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Update when adding new endpoints

### User Documentation

- Update setup guides for new features
- Add screenshots for UI changes
- Keep architecture docs current
- Write clear commit messages

## Performance Guidelines

### Backend Performance

- Use async/await for I/O operations
- Implement proper database indexing
- Cache frequently accessed data
- Optimize database queries

### Frontend Performance

- Use React.memo for expensive components
- Implement lazy loading
- Optimize bundle size
- Use efficient state management

## Security Guidelines

### General Security

- Never commit sensitive data
- Use environment variables for secrets
- Validate all user inputs
- Implement proper authentication

### Database Security

- Use parameterized queries
- Implement Row Level Security
- Validate data at multiple levels
- Follow principle of least privilege

## Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers updated
- [ ] Security review completed
- [ ] Performance testing done

## Getting Help

### Resources

- [Setup Guide](SETUP.md)
- [API Documentation](API.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Main README](../README.md)

### Communication

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Code Review**: Use pull request comments for code feedback

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## License

By contributing to ChargeX, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ChargeX! Your efforts help make this project better for everyone.

# Test Cases - At-Home Healthcare Project

This folder contains comprehensive test cases for the At-Home Healthcare React TypeScript application.

## 🧪 Testing Framework Setup

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **TypeScript Support** - Full TypeScript integration
- **Coverage Reports** - Code coverage analysis

## 📁 Test Structure

```
testcases/
├── README.md                    # This file
├── setup.ts                     # Test setup and mocks
├── run-tests.js                 # Test runner script
├── components/
│   ├── services/
│   │   └── services.test.tsx    # Services component tests
│   ├── doctor-detail/
│   │   └── doctor-detail.test.tsx # DoctorDetail component tests
│   ├── core/
│   │   ├── protected-route.test.tsx # ProtectedRoute component tests
│   │   └── language-switcher.test.tsx # LanguageSwitcher component tests
│   ├── dashboard/
│   │   └── sidebar.test.tsx    # Sidebar component tests
│   └── doctors/
│       ├── toast.test.tsx       # Toast component tests
│       └── modal.test.tsx       # Modal component tests
├── pages/
│   ├── auth/
│   │   ├── login.test.tsx       # Login component tests
│   │   └── forgot-password.test.tsx # Forgot password tests
│   ├── dashboard/
│   │   └── dashboard.test.tsx    # Dashboard page tests
│   ├── forms/
│   │   └── forms.test.tsx       # Forms management tests
│   ├── providers/
│   │   └── providers.test.tsx   # Providers management tests
│   ├── requests/
│   │   └── requests.test.tsx   # Requests management tests
│   └── configuration/
│       └── configuration.test.tsx # Configuration settings tests
├── hooks/
│   └── redux.test.tsx           # Redux hooks tests
└── ../src/__tests__/            # React Scripts compatible tests
    ├── simple.test.tsx          # Basic functionality tests
    └── basic.test.tsx           # Setup verification tests
```

## 🚀 How to Run Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Basic functionality tests
npm test -- --testPathPattern=simple.test.tsx

# Services component tests
npm test -- --testPathPattern=services.test.tsx

# DoctorDetail component tests
npm test -- --testPathPattern=doctor-detail.test.tsx
```

### Run with Coverage
```bash
npm test -- --coverage --watchAll=false
```

### Run in Watch Mode
```bash
npm test
```

### Use Custom Test Runner
```bash
node testcases/run-tests.js
```

## 📊 Test Categories

### 1. Basic Functionality Tests (`simple.test.tsx`)
- Component rendering
- Element querying
- User interactions
- Mock functions
- Async operations

### 2. Services Component Tests (`services.test.tsx`)
- Page header rendering
- Search functionality
- Service statistics display
- Data filtering

### 3. DoctorDetail Component Tests (`doctor-detail.test.tsx`)
- Doctor profile information
- Approval actions
- Status display
- Internal notes handling

### 4. Core Components Tests
- **ProtectedRoute** (`protected-route.test.tsx`)
  - Authentication state handling
  - Loading states
  - Redirect functionality
  - Protected content rendering

- **LanguageSwitcher** (`language-switcher.test.tsx`)
  - Language switching functionality
  - Active language highlighting
  - Button styling and interactions

- **Sidebar** (`sidebar.test.tsx`)
  - Navigation rendering
  - Active route highlighting
  - Logout functionality
  - Navigation structure

### 5. Doctors Components Tests
- **Toast** (`toast.test.tsx`)
  - Message display and hiding
  - Auto-hide functionality
  - Timer cleanup
  - Multiple toast handling

- **Modal** (`modal.test.tsx`)
  - Approval and rejection modals
  - Modal open/close states
  - Button interactions
  - Textarea handling

### 6. Pages Tests
- **Dashboard** (`dashboard.test.tsx`)
  - Statistics display
  - Recent activity
  - Chart rendering
  - Export functionality

- **Forms** (`forms.test.tsx`)
  - Form management
  - CRUD operations
  - Search and filtering
  - Pagination

- **Authentication** (`auth/`)
  - **Login** (`login.test.tsx`)
    - Form rendering and validation
    - Authentication flow
    - Loading states
    - Password visibility toggle
    - Remember me functionality
    - Error handling
  - **Forgot Password** (`forgot-password.test.tsx`)
    - Email input validation
    - Reset link sending
    - Rate limiting
    - Success/error states
    - Form accessibility

- **Providers** (`providers.test.tsx`)
  - Provider listing and management
  - Search and filtering
  - Status management
  - CRUD operations
  - Pagination
  - Empty states

- **Requests** (`requests.test.tsx`)
  - Request listing and filtering
  - Bulk actions
  - Request approval/rejection
  - Detail modal display
  - Statistics dashboard
  - Pagination

- **Configuration** (`configuration.test.tsx`)
  - System settings management
  - Email configuration
  - Security settings
  - Backup configuration
  - Tab navigation
  - Form validation

### 7. Hooks Tests
- **Redux Hooks** (`redux.test.tsx`)
  - State selection
  - Dispatch actions
  - Authentication state
  - Complex state management

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
- TypeScript support with `ts-jest`
- JSDOM environment
- CSS modules mocking
- Coverage settings

### Test Setup (`setup.ts`)
- Browser API mocks (IntersectionObserver, ResizeObserver)
- MatchMedia mock
- ScrollTo mock
- Jest-DOM custom matchers

## 📝 Writing New Tests

### Test File Naming Convention
- Use `.test.tsx` or `.spec.tsx` extension
- Place in `src/__tests__/` for React Scripts compatibility
- Or place in `testcases/components/` for organization

### Test Structure Example
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('ComponentName Tests', () => {
  test('should render component', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('should handle user interactions', () => {
    const mockFn = jest.fn();
    render(<YourComponent onAction={mockFn} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## 🎯 Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries (getByRole, getByLabelText)**
3. **Mock external dependencies**
4. **Keep tests focused and simple**
5. **Use descriptive test names**
6. **Test happy paths and edge cases**

## 🐛 Debugging Tests

### Console Logs
```bash
# Run tests with console output
npm test -- --verbose
```

### Interactive Mode
```bash
# Run failing tests interactively
npm test -- --watch
```

### Coverage Analysis
```bash
# Generate coverage report
npm test -- --coverage
```

Coverage reports will be generated in the `coverage/` folder.

## 📈 Current Test Coverage

- ✅ Basic React functionality
- ✅ Component rendering
- ✅ User interactions
- ✅ Mock implementations
- ✅ Services component features
- ✅ DoctorDetail component features

## 🔄 Continuous Integration

These tests are designed to work with CI/CD pipelines:

```bash
# CI mode (no watch)
npm test -- --watchAll=false --ci

# Coverage for CI
npm test -- --coverage --watchAll=false --ci
```

## 🚨 Troubleshooting

### Common Issues

1. **ES Module Errors**: Use `import` instead of `require()` in test files
2. **Missing Mocks**: Check `setup.ts` for required browser API mocks
3. **TypeScript Errors**: Ensure `.test.tsx` files are included in `tsconfig.json`
4. **CSS Import Errors**: CSS modules are mocked in Jest configuration

### Getting Help

- Check Jest documentation: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- TypeScript Jest setup: https://kulshekhar.github.io/ts-jest/docs/getting-started/installation

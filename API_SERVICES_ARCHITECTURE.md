# API Services Architecture - Healthorate

## ✅ Professional Structure Implemented

### 1. **Configuration Layer** (`/config/apiConfig.js`)
Centralized configuration management:
- API base URL and timeout settings
- All API endpoints in one place
- Storage keys constants
- Toast messages templates
- **No hardcoded values in components**

### 2. **API Client Layer** (`/services/api.js`)
Axios instance with interceptors:
- Automatic token injection
- Global error handling
- Network error detection
- Auto-redirect on 401 (unauthorized)
- Request/Response logging

### 3. **Service Layer** (`/services/authService.js`)
Business logic and API calls:
- **Class-based architecture** (Singleton pattern)
- JSDoc documentation for all methods
- Automatic token/customer data management
- Helper methods (isAuthenticated, getCustomer, etc.)
- Clean separation of concerns

## 📁 File Structure

```
frontend/src/
├── config/
│   └── apiConfig.js          # All configuration & constants
├── services/
│   ├── api.js                # Axios instance & interceptors
│   └── authService.js        # Authentication service class
└── pages/auth/
    ├── Login.jsx             # Uses: authService.login()
    ├── Register.jsx          # Uses: authService.register()
    ├── OtpVerify.jsx         # Uses: authService.verifyOTP()
    ├── ForgotPassword.jsx    # Uses: authService.forgotPassword()
    └── SetNewPassword.jsx    # Uses: authService.resetPassword()
```

## 🎯 Usage Examples

### In Components:
```javascript
import authService from '../../services/authService';

// Login
const response = await authService.login(email, password);

// Register
const response = await authService.register(email, password, confirmPassword);

// Check if authenticated
if (authService.isAuthenticated()) {
    // User is logged in
}

// Get current customer
const customer = authService.getCustomer();

// Logout
authService.logout();
```

### Adding New Endpoints:
```javascript
// 1. Add to apiConfig.js
export const API_ENDPOINTS = {
    AUTH: { ... },
    PATHOLOGY: {
        LIST: '/pathology/list',
        DETAILS: '/pathology/:id',
        SEARCH: '/pathology/search'
    }
};

// 2. Create new service file
// services/pathologyService.js
import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

class PathologyService {
    async getList(params) {
        const response = await api.get(API_ENDPOINTS.PATHOLOGY.LIST, { params });
        return response.data;
    }
    
    async getDetails(id) {
        const url = API_ENDPOINTS.PATHOLOGY.DETAILS.replace(':id', id);
        const response = await api.get(url);
        return response.data;
    }
}

export default new PathologyService();
```

## ✨ Benefits

### 1. **No Hardcoding**
- All URLs in one place (apiConfig.js)
- Easy to change for different environments
- No magic strings in components

### 2. **Maintainability**
- Single source of truth for all API calls
- Easy to add new endpoints
- Consistent error handling

### 3. **Reusability**
- Service methods can be used anywhere
- No code duplication
- DRY principle followed

### 4. **Type Safety** (Future)
- Easy to add TypeScript
- JSDoc provides IntelliSense
- Clear method signatures

### 5. **Testing**
- Easy to mock services
- Isolated business logic
- Clear dependencies

## 🔐 Authentication Flow

```
Component → authService → api (axios) → Backend API
                ↓
        Auto-save token/customer
                ↓
        Return response to component
```

## 🛡️ Error Handling

### Automatic Handling:
- 401: Auto logout + redirect to login
- Network errors: User-friendly message
- Token expiry: Auto cleanup

### Manual Handling in Components:
```javascript
try {
    const response = await authService.login(email, password);
    toast.success(response.message);
} catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
}
```

## 📝 Environment Variables

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.healthorate.com/api
```

## 🚀 Next Steps

1. ✅ Auth service implemented
2. 🔄 Add PathologyService
3. 🔄 Add LabService
4. 🔄 Add CartService
5. 🔄 Add OrderService

## 📚 Best Practices Followed

1. ✅ Separation of Concerns
2. ✅ Single Responsibility Principle
3. ✅ DRY (Don't Repeat Yourself)
4. ✅ Configuration Management
5. ✅ Error Handling
6. ✅ Code Documentation
7. ✅ Consistent Naming Conventions
8. ✅ Singleton Pattern for Services

---

**No hardcoded values, everything is configurable and maintainable!** 🎉

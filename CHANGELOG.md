# Changelog

## [1.1.0] - 2025-01-19

### Added
- Google OAuth authentication support for sign up and sign in
- Protected routes for authenticated users only
- Email/password authentication system
- Loading state to prevent race conditions during auth

### Fixed
- ProtectedRoute redirect issue where Google login redirected to login immediately
- Added 100ms delay to ensure auth state updates before checking authentication

### Changed
- ProtectedRoute component with loading state
- Login and Signup components with Google Sign-In buttons
- AuthContext with loginWithGoogle function
- main.tsx with GoogleOAuthProvider wrapper

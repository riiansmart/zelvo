/**
 * PrivateRoute.tsx
 * Higher-order component that protects routes from unauthorized access.
 * Implements route-based authentication control using React Router.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Access auth context
import { JSX } from 'react';

/**
 * Props for the PrivateRoute component
 * @interface Props
 * @property {JSX.Element} children - The protected route component to render
 */
interface Props {
  children: JSX.Element; // Route component to render
}

/**
 * PrivateRoute Component
 * Wraps protected routes and handles authentication-based access control.
 * Features:
 * - Automatic redirect for unauthenticated users
 * - Seamless integration with React Router
 * - Clean fallback to home route
 * 
 * Usage:
 * ```tsx
 * <Route
 *   path="/protected"
 *   element={
 *     <PrivateRoute>
 *       <ProtectedComponent />
 *     </PrivateRoute>
 *   }
 * />
 * ```
 * 
 * @param {Props} props - Component props
 * @returns {JSX.Element} The protected route or redirect
 */
const PrivateRoute = ({ children }: Props) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />; // Redirect if not logged in
};

export default PrivateRoute;
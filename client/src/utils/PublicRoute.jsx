import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children, user }) => {
    // If we have a user (from props) or token (fallback checkout), redirect to dashboard
    const token = localStorage.getItem('token');

    // We prefer the user prop for immediate reactivity, but check token for persistence
    if (user || token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;

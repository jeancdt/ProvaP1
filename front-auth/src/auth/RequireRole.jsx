import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function RequireRole({ role, children }) {
    const { user } = useAuth();

    if (!user || user.role !== role) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}

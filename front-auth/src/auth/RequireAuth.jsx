import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
    const { token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ padding: 24 }}>
                <p>Carregando sessão...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

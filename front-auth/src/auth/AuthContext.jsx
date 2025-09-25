import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        setToken(t || null);
        try {
            setUser(u ? JSON.parse(u) : null);
        } catch {
            localStorage.removeItem("user");
            setUser(null);
        }
        setLoading(false);
    }, []);

    async function login({ email, password }) {
        const { data } = await http.post("/auth/login", { email, password });

        if (!data?.token) throw new Error("Token ausente na resposta");

        localStorage.setItem("token", data.token);

        setToken(data.token);

        if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
        } else {
            localStorage.removeItem("user");
            setUser(null);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    const value = useMemo(
        () => ({ token, user, login, logout, loading }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
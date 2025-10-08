import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <nav className="navbar-inner">
                <div className="brand">MeuFront</div>
                <ul className="nav-links">
                    <li><NavLink to="/" end className={({ isActive }) => isActive ?
                        "active" : ""}>Página Inicial</NavLink></li>
                    <li><NavLink to="/events">Eventos</NavLink></li>
                    {user && <li><NavLink to="/volunteers">Voluntários</NavLink></li>}
                    {!user && <li><NavLink to="/login">Login</NavLink></li>}
                    {user && (
                        <>
                            <li><NavLink to="/dashboard">Painel de Controle</NavLink></li>
                            {user.role === "admin" && <li><NavLink
                                to="/admin">Administrador</NavLink></li>}
                            <li><button className="btn" onClick={logout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <nav className="navbar-inner">
                <div className="brand">CorpApps</div>
                <ul className="nav-links">
                    <li><NavLink to="/" end className={({ isActive }) => isActive ?
                        "active" : ""}>Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/events">Events</NavLink></li>
                    {!user && <li><NavLink to="/login">Login</NavLink></li>}
                    {user && (
                        <>
                            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                            {user.role === "admin" && <li><NavLink
                                to="/admin">Admin</NavLink></li>}
                            <li><button className="btn" onClick={logout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

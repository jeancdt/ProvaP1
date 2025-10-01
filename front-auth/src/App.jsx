import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Forbidden from "./pages/Forbidden";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Events from "./pages/Events";

function NotFound() {
  return (
    <main className="container">
      <h1>404 — Página não encontrada</h1>
      <p>Verifique a URL ou volte para a Home.</p>
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <Events /> },
      { path: "login", element: <Login /> },
      { path: "forbidden", element: <Forbidden /> },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAuth>
            <RequireRole role="admin">
              <Admin />
            </RequireRole>
          </RequireAuth>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

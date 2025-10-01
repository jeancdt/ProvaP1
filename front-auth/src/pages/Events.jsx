import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    http
      .get("/events")
      .then(({ data }) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar eventos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Eventos</h1>
        {user?.role === "admin" && (
          <Link to="/events/create">
            <Button>Criar Evento</Button>
          </Link>
        )}
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {!loading &&
        !error &&
        (events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Local</th>
                  <th>Início</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.title}</td>
                    <td>{ev.location || "-"}</td>
                    <td>{new Date(ev.start_date).toLocaleString()}</td>
                    <td>{ev.end_date ? new Date(ev.end_date).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadEvents = () => {
    http
      .get("/events")
      .then(({ data }) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar eventos"));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${title}"?`)) {
      try {
        await http.delete(`/protected/events/${id}`);
        loadEvents();
      } catch (err) {
        alert(err.response?.data?.message || "Erro ao excluir evento");
      }
    }
  };

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
      {error && <p>{error}</p>}
      {!error &&
        (events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Título</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Descrição</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Local</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Voluntários</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Início</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Fim</th>
                  {user?.role === "admin" && (
                    <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Ações</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {event.title}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {event.description || "-"}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {event.location || "-"}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {event.volunteers || "Sem voluntários"}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {new Date(event.start_date).toLocaleString()}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {event.end_date ? new Date(event.end_date).toLocaleString() : "-"}
                    </td>
                    {user?.role === "admin" && (
                      <td
                        style={{
                          borderLeft: "1px solid #000",
                          borderRight: "1px solid #000",
                          padding: "0.5rem",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <Link to={`/events/edit/${event.id}`}>
                            <Button>Editar</Button>
                          </Link>
                          <button
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                              cursor: "pointer"
                            }}
                            onClick={() => handleDelete(event.id, event.title)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? "7" : "6"}
                    style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}
                  >
                    Total de eventos: {events.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
    </section>
  );
}

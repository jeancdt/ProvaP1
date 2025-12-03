import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadVolunteers = () => {
    http
      .get("/protected/volunteers")
      .then(({ data }) => setVolunteers(data.volunteers || []))
      .catch(() => setError("Erro ao carregar voluntários"));
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o voluntário "${name}"?`)) {
      try {
        await http.delete(`/protected/volunteers/${id}`);
        loadVolunteers();
      } catch (err) {
        alert(err.response?.data?.message || "Erro ao excluir voluntário");
      }
    }
  };

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Voluntários</h1>
        {user?.role === "admin" && (
          <Link to="/volunteers/create">
            <Button>Cadastrar Voluntário</Button>
          </Link>
        )}
      </div>
      {error && <p>{error}</p>}
      {!error &&
        (volunteers.length === 0 ? (
          <p>Nenhum voluntário encontrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Nome</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Telefone</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Email</th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Data de Cadastro</th>
                  {user.role === "admin" && (
                    <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}>Ações</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {volunteer.name}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {volunteer.phone}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {volunteer.email || "Sem email cadastrado"}
                    </td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "0.5rem" }}>
                      {volunteer.created_at ? new Date(volunteer.created_at).toLocaleDateString() : "-"}
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
                          <Link to={`/volunteers/edit/${volunteer.id}`}>
                            <Button>Editar</Button>
                          </Link>
                          <button
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                            }}
                            onClick={() => handleDelete(volunteer.id, volunteer.name)}
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
                    colSpan={user?.role === "admin" ? "5" : "4"}
                    style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "center" }}
                  >
                    Total de voluntários: {volunteers.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
    </section>
  );
}

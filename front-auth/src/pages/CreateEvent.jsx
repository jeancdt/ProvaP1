import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    volunteer_ids: [],
  });
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/protected/volunteers")
      .then(({ data }) => setVolunteers(data.volunteers || []))
      .catch(() => setError("Erro ao carregar voluntários"));

    if (isEditing) {
      http
        .get(`/events/${id}`)
        .then(({ data }) => {
          // Converte data
          const formatDateTime = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          };

          setForm({
            title: data.title,
            description: data.description,
            location: data.location,
            start_date: formatDateTime(data.start_date),
            end_date: formatDateTime(data.end_date),
            volunteer_ids: data.volunteer_ids || [],
          });
        })
        .catch(() => setError("Erro ao carregar dados do evento"));
    }
  }, [id, isEditing]);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleVolunteerToggle(volunteerId) {
    const currentIds = form.volunteer_ids;
    const newIds = currentIds.includes(volunteerId)
      ? currentIds.filter((id) => id !== volunteerId)
      : [...currentIds, volunteerId];

    setForm({ ...form, volunteer_ids: newIds });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.volunteer_ids.length < 1) {
      setError("Selecione pelo menos 1 voluntário");
      return;
    }

    if (form.volunteer_ids.length > 3) {
      setError("Selecione no máximo 3 voluntários");
      return;
    }

    try {
      if (isEditing) {
        await http.put(`/protected/events/${id}`, form);
      } else {
        await http.post("/protected/events", form);
      }
      navigate("/events", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar evento");
    }
  }

  return (
    <section className="card">
      <h1>{isEditing ? "Editar Evento" : "Criar Novo Evento"}</h1>
      {error && (
        <p
          className="alert"
          style={{ color: "red", padding: "0.5rem", backgroundColor: "#ffe6e6", borderRadius: "0.25rem" }}
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <FormInput
            label="Título"
            type="text"
            name="title"
            value={form.title}
            placeholder="Digite o título do evento"
            onChange={updateField}
            required
          />
          <label className="form-group" style={{ display: "flex" }}>
            <span className="form-label">Descrição</span>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              placeholder="Descreva o evento"
              onChange={updateField}
              rows="1"
              required
            />
          </label>
          <FormInput
            label="Local"
            type="text"
            name="location"
            value={form.location}
            placeholder="Local do evento"
            onChange={updateField}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <FormInput
            label="Data e Hora de Início"
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={updateField}
            required
          />
          <FormInput
            label="Data e Hora de Término"
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={updateField}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>Voluntários (mínimo 1, máximo 3)</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "0.5rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
          >
            {volunteers.length === 0 ? (
              <p>Carregando voluntários...</p>
            ) : (
              volunteers.map((volunteer) => (
                <label
                  key={volunteer.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    border: `2px solid ${form.volunteer_ids.includes(volunteer.id) ? "#2196f3" : "#ccc"}`,
                    borderRadius: "0.25rem",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.volunteer_ids.includes(volunteer.id)}
                    onChange={() => handleVolunteerToggle(volunteer.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>{volunteer.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <Button type="submit">{isEditing ? "Atualizar Evento" : "Criar Evento"}</Button>
      </form>
    </section>
  );
}

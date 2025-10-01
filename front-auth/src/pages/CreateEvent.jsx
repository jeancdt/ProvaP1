import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState("");

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await http.post("/protected/events", form);
      navigate("/events", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar evento");
    }
  }

  return (
    <section className="card">
      <h1>Criar Novo Evento</h1>
      {error && <p className="alert">{error}</p>}
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
        <Button type="submit">Criar Evento</Button>
      </form>
    </section>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function CreateVolunteer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      http
        .get(`/protected/volunteers/${id}`)
        .then(({ data }) => setForm({
          name: data.volunteer.name,
          phone: data.volunteer.phone,
          email: data.volunteer.email || "",
        }))
        .catch(() => setError("Erro ao carregar dados do voluntário"));
    }
  }, [id, isEditing]);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (isEditing) {
        await http.put(`/protected/volunteers/${id}`, form);
      } else {
        await http.post("/protected/volunteers", form);
      }
      navigate("/volunteers", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || `Erro ao atualizar ou cadastrar voluntário`);
    }
  }

  return (
    <section className="card">
      <h1>{isEditing ? "Editar Voluntário" : "Cadastrar Novo Voluntário"}</h1>
      {error && <p className="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <FormInput
            label="Nome Completo"
            type="text"
            name="name"
            value={form.name}
            placeholder="Digite o nome completo do voluntário"
            onChange={updateField}
            required
          />
          <FormInput
            label="Telefone"
            type="tel"
            name="phone"
            value={form.phone}
            placeholder="(51) 99999-9999"
            onChange={updateField}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            placeholder="voluntario@email.com"
            onChange={updateField}
            required
          />
        </div>
        <Button type="submit">{isEditing ? "Atualizar Voluntário" : "Cadastrar Voluntário"}</Button>
      </form>
    </section>
  );
}


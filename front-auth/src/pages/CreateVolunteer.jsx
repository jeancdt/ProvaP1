import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function CreateVolunteer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await http.post("/protected/volunteers", form);
      navigate("/volunteers", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar voluntário");
    }
  }

  return (
    <section className="card">
      <h1>Cadastrar Novo Voluntário</h1>
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
        <Button type="submit">Cadastrar Voluntário</Button>
      </form>
    </section>
  );
}


import { useEffect, useState } from "react";
import { http } from "../api/http";

export default function Admin() {
    const [msg, setMsg] = useState("Carregando...");

    useEffect(() => {
        http.get("/protected/admin")
            .then(({ data }) => setMsg(data.message))
            .catch(() => setMsg("Acesso negado"));
    }, []);
    return (
        <section className="card">
            <h1>Área Administrativa</h1>
            <p>{msg}</p>
        </section>
    );
}
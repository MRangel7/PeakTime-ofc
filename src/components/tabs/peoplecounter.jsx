import { useEffect, useState } from "react";

export default function PeopleCounter({ isAdmin }) {
  const [total, setTotal] = useState(0);

  // Buscar valor atual ao carregar
  useEffect(() => {
    fetch("http://localhost:5000/contador-atual")
      .then(res => res.json())
      .then(data => setTotal(data.total));
  }, []);

  // Incrementar
  const incrementar = async () => {
    const res = await fetch("http://localhost:5000/incrementar", {
      method: "POST"
    });
    const data = await res.json();
    setTotal(data.total);
  };

  // Decrementar
  const decrementar = async () => {
    const res = await fetch("http://localhost:5000/decrementar", {
      method: "POST"
    });
    const data = await res.json();
    setTotal(data.total);
  };

  return (
  <div style={{ textAlign: "center" }}>
    {isAdmin && (
      <>
        <h2>Pessoas presentes: {total}</h2>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
  
  <button
    onClick={incrementar}
    style={{
      backgroundColor: "#0f0f0f",
      color: "#00ff99",
      border: "2px solid #00ff99",
      padding: "12px 22px",
      borderRadius: "12px",
      fontSize: "18px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }}
  >
    +1 pessoa
  </button>

  <button
    onClick={decrementar}
    style={{
      backgroundColor: "#0f0f0f",
      color: "#ff4d4d",
      border: "2px solid #ff4d4d",
      padding: "12px 22px",
      borderRadius: "12px",
      fontSize: "18px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }}
  >
    -1 pessoa
  </button>

</div>

      </>
    )}
  </div>
);

}

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
      <h2>Pessoas presentes: {total}</h2>

      {isAdmin && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={decrementar}>-</button>
          <button onClick={incrementar}>+</button>
        </div>
      )}
    </div>
  );
}

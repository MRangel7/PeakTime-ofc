// src/components/tabs/PeakTimeTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { TrendingUp, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type FluxoItem = { hora: string; pessoas: number };
type PrevisaoItem = { hora: string; valor: number };

// 🔥 TOOLTIP PERSONALIZADO
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.7)",
        padding: "8px 12px",
        borderRadius: "6px",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <p style={{ margin: 0 }}>{label}</p>
      <p style={{ margin: 0, fontWeight: "bold" }}>
        Pessoas: {payload[0].value}
      </p>
    </div>
  );
};

export const PeakTimeTab = () => {
  const [fluxoData, setFluxoData] = useState<FluxoItem[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoItem[] | null>(null);
  const capacidadeMaxima = 100;

  // carregar dados do backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/counts")
      .then((res) => res.json())
      .then((data) => {
        const parsed = (data || []).map((d: any) => ({
          hora: d.hora ?? d.hour ?? d.Hora ?? "--:--",
          pessoas: Number(d.pessoas ?? d.total_people ?? 0),
        }));
        setFluxoData(parsed);
      })
      .catch((err) => console.error("Erro ao carregar dados:", err));
  }, []);

  // gerar previsões
  const gerarPrevisao = async () => {
    if (!fluxoData || fluxoData.length === 0) {
      alert("Sem dados suficientes.");
      return;
    }

    const ultimas = fluxoData.slice(-5).map((it) => Number(it.pessoas));
    const now = new Date();
    const hora = now.getHours();
    const minuto = now.getMinutes();

    try {
      const response = await fetch("http://127.0.0.1:5000/prever_lotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ultimas5: ultimas,
          hora,
          minuto,
        }),
      });

      const data = await response.json();

      if (Array.isArray(data.previsoes)) {
        setPrevisoes(
          data.previsoes.map((p: any) => ({
            hora: String(p.hora),
            valor: Number(p.valor ?? p.previsao ?? 0),
          }))
        );
      } else {
        alert("Resposta de previsão inválida.");
      }
    } catch (err) {
      console.error("Erro gerar previsao:", err);
      alert("Erro ao gerar previsão.");
    }
  };

  const pessoasAtuais = fluxoData.length ? fluxoData[fluxoData.length - 1].pessoas : 0;
  const percentualOcupacao = (pessoasAtuais / capacidadeMaxima) * 100;

  const pico = fluxoData.reduce(
    (max, item) => (item.pessoas > (max.pessoas ?? -Infinity) ? item : max),
    fluxoData[0] || { hora: "--:--", pessoas: 0 }
  );

  // bandas de fundo (AJUSTADAS)
  const bands = [
    { y1: 0, y2: 30, fill: "#1B5E20" },
    { y1: 30, y2: 60, fill: "#0D47A1" },
    { y1: 60, y2: 80, fill: "#F9A825" },
    { y1: 80, y2: 100, fill: "#D32F2F" },
  ];

  const fluxoParaGrafico = fluxoData.map((d) => ({
    hora: d.hora,
    pessoas: Number(d.pessoas),
  }));

  const previsoesParaGrafico = (p: PrevisaoItem[] | null) =>
    p ? p.map((it) => ({ hora: it.hora, pessoas: it.valor })) : [];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">

      {/* STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Pessoas Agora</p>
                <p className="text-4xl font-bold">{pessoasAtuais}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Ocupação</p>
                <p className="text-4xl font-bold">{percentualOcupacao.toFixed(0)}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Pico do Dia</p>
                <p className="text-4xl font-bold">{pico?.hora || "--:--"}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICO DO DIA */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Fluxo de Pessoas - Hoje
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fluxoParaGrafico}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="hora" />
              <YAxis domain={[0, 100]} />

              {/* Tooltip customizado */}
              <Tooltip content={<CustomTooltip />} />

              {bands.map((b, i) => (
                <ReferenceArea
                  key={i}
                  y1={b.y1}
                  y2={b.y2}
                  fill={b.fill}
                  fillOpacity={0.25}
                />
              ))}

              {/* linha branca */}
              <Line
                type="monotone"
                dataKey="pessoas"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Botão */}
      <button
        onClick={gerarPrevisao}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Gerar Previsão
      </button>

      {/* Gráfico de Previsões */}
      {previsoes && (
        <Card className="bg-gradient-card shadow-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Possível Fluxo de Pessoas nos Próximos Horários
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={previsoesParaGrafico(previsoes)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="hora" />
                <YAxis domain={[0, 100]} />

                {/* Tooltip customizado */}
                <Tooltip content={<CustomTooltip />} />

                {bands.map((b, i) => (
                  <ReferenceArea
                    key={i}
                    y1={b.y1}
                    y2={b.y2}
                    fill={b.fill}
                    fillOpacity={0.25}
                  />
                ))}

                <Line
                  type="monotone"
                  dataKey="pessoas"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Dados simulados de fluxo de pessoas na academia

export const PeakTimeTab = () => {
  const [fluxoData, setFluxoData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/counts")
      .then((res) => res.json())
      .then((data) => setFluxoData(data))
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }, []);

  const projecaoData = fluxoData.slice(-5).map((item, index) => ({
    hora: index === 0 ? "Agora" : `+${index}h`,
    pessoas: item.pessoas,
  }));

  const pessoasAtuais = fluxoData.length
    ? fluxoData[fluxoData.length - 1].pessoas
    : 0;

  const capacidadeMaxima = 100;
  const percentualOcupacao = (pessoasAtuais / capacidadeMaxima) * 100;

  const pico = fluxoData.reduce(
    (max, item) => (item.pessoas > max.pessoas ? item : max),
    fluxoData[0] || {}
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Status Atual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  Pessoas Agora
                </p>
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
                <p className="text-4xl font-bold">
                  {percentualOcupacao.toFixed(0)}%
                </p>
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
                <p className="text-muted-foreground text-sm mb-1">
                  Pico do Dia
                </p>
                <p className="text-4xl font-bold">{pico?.hora || "--:--"}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Fluxo do Dia */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Fluxo de Pessoas - Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fluxoData}>
              <defs>
                <linearGradient id="colorPessoas" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(210 100% 50%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(210 100% 50%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="pessoas"
                stroke="hsl(210 100% 50%)"
                strokeWidth={2}
                fill="url(#colorPessoas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projeção Futura */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Projeção para as Próximas Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={projecaoData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="pessoas"
                stroke="hsl(210 100% 50%)"
                strokeWidth={3}
                dot={{ fill: "hsl(210 100% 50%)", r: 6 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            💡 Baseado em dados históricos e padrões de frequência
          </p>
        </CardContent>
      </Card>

      {/* Informação sobre Banco de Dados */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            📊 Os dados exibidos são simulados para teste.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

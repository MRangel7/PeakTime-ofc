import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Users, Clock } from "lucide-react";

// Dados simulados de fluxo de pessoas na academia
const fluxoData = [
  { hora: "06:00", pessoas: 12 },
  { hora: "07:00", pessoas: 28 },
  { hora: "08:00", pessoas: 45 },
  { hora: "09:00", pessoas: 38 },
  { hora: "10:00", pessoas: 25 },
  { hora: "11:00", pessoas: 18 },
  { hora: "12:00", pessoas: 22 },
  { hora: "13:00", pessoas: 15 },
  { hora: "14:00", pessoas: 20 },
  { hora: "15:00", pessoas: 28 },
  { hora: "16:00", pessoas: 35 },
  { hora: "17:00", pessoas: 52 },
  { hora: "18:00", pessoas: 68 },
  { hora: "19:00", pessoas: 75 },
  { hora: "20:00", pessoas: 62 },
  { hora: "21:00", pessoas: 42 },
  { hora: "22:00", pessoas: 28 },
];

// Projeção para as próximas horas
const projecaoData = [
  { hora: "Agora", pessoas: 45 },
  { hora: "+1h", pessoas: 52 },
  { hora: "+2h", pessoas: 68 },
  { hora: "+3h", pessoas: 75 },
  { hora: "+4h", pessoas: 62 },
];

export const PeakTimeTab = () => {
  const pessoasAtuais = 45;
  const capacidadeMaxima = 100;
  const percentualOcupacao = (pessoasAtuais / capacidadeMaxima) * 100;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Status Atual */}
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
                <p className="text-4xl font-bold">19:00</p>
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
                  <stop offset="5%" stopColor="hsl(210 100% 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(210 100% 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
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
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="pessoas" 
                stroke="hsl(210 100% 50%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(210 100% 50%)', r: 6 }}
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
            📊 Os dados exibidos são simulados. Para conectar ao banco de dados real, 
            configure a URL do banco SQL no código-fonte (arquivo: banco_academia_ficticio.sql)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
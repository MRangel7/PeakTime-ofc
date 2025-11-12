import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, TrendingUp, Users, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo e Hero */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-3xl mb-6 shadow-glow animate-pulse">
            <Dumbbell className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            PeakTime
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sua academia inteligente. Treinos personalizados, acompanhamento em tempo real e uma comunidade dedicada ao seu progresso.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => navigate("/login")}
              className="bg-gradient-primary hover:opacity-90 transition-smooth text-lg px-8 py-6"
            >
              Entrar na Plataforma
            </Button>
            <Button 
              onClick={() => navigate("/cadastro")}
              variant="outline"
              className="text-lg px-8 py-6 hover:bg-muted"
            >
              Criar Conta
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">PeakTime Monitor</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe o fluxo em tempo real e escolha o melhor horário para treinar
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Dumbbell className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Treinos Personalizados</h3>
              <p className="text-muted-foreground text-sm">
                Gerencie seus treinos e acompanhe sua evolução de forma inteligente
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Eventos Exclusivos</h3>
              <p className="text-muted-foreground text-sm">
                Participe de aulas especiais e eventos da nossa comunidade
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

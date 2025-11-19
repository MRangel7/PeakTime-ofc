import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Phone, LogOut, UserPlus, HelpCircle, FileText, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface PerfilTabProps {
  userType: "user" | "admin";
}

const faqData = [
  {
    question: "Qual o horário de funcionamento?",
    answer: "Funcionamos de segunda a sexta das 6h às 23h, sábados das 8h às 20h e domingos das 8h às 18h."
  },
  {
    question: "Como cancelo minha matrícula?",
    answer: "Entre em contato pelo telefone (00) 0 0000-0000 ou envie um e-mail para peaktimecorp@gmail.com com 30 dias de antecedência."
  },
  {
    question: "Posso trazer um convidado?",
    answer: "Sim! Cada aluno tem direito a trazer 1 convidado por mês gratuitamente."
  },
  {
    question: "Vocês oferecem avaliação física?",
    answer: "Sim, oferecemos avaliação física gratuita para todos os alunos a cada 3 meses."
  },
];

export const PerfilTab = ({ userType }: PerfilTabProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [novoAdmin, setNovoAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const userName = localStorage.getItem("userName") || "Usuário";
  const userEmail = localStorage.getItem("userEmail") || "usuario@email.com";
  const userPhone = localStorage.getItem("userPhone") || "(00) 0 0000-0000";

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const handleAddAdmin = () => {
    if (novoAdmin.name && novoAdmin.email && novoAdmin.phone && novoAdmin.password) {
      // In production, this would create a new admin
      toast.success("Novo administrador adicionado com sucesso!");
      setNovoAdmin({ name: "", email: "", phone: "", password: "" });
    } else {
      toast.error("Preencha todos os campos!");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 max-w-4xl">
      {/* Informações do Usuário */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Informações do {userType === "admin" ? "Administrador" : "Usuário"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-semibold">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-semibold">{userPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tema */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-semibold">Tema</p>
                <p className="text-sm text-muted-foreground">
                  {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                </p>
              </div>
            </div>
            <Button onClick={toggleTheme} variant="outline">
              Alternar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Novo ADM (apenas para admin) */}
      {userType === "admin" && (
        <Card className="bg-gradient-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" />
              Gerenciar Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Novo ADM
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Administrador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={novoAdmin.name}
                      onChange={(e) => setNovoAdmin({ ...novoAdmin, name: e.target.value })}
                      placeholder="Nome do administrador"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={novoAdmin.email}
                      onChange={(e) => setNovoAdmin({ ...novoAdmin, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      type="tel"
                      value={novoAdmin.phone}
                      onChange={(e) => setNovoAdmin({ ...novoAdmin, phone: e.target.value })}
                      placeholder="(00) 0 0000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={novoAdmin.password}
                      onChange={(e) => setNovoAdmin({ ...novoAdmin, password: e.target.value })}
                      placeholder="Senha do administrador"
                    />
                  </div>
                  <Button onClick={handleAddAdmin} className="w-full bg-gradient-primary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar Administrador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contato da Academia */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-accent" />
            Contato da Academia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>(00) 0 0000-0000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>peaktimecorp@gmail.com</span>
          </div>
        </CardContent>
      </Card>

      {/* Termos de Uso */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Termos de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ao utilizar nossos serviços, você concorda com nossos termos de uso e política de privacidade. 
            Para mais informações, entre em contato com nossa equipe.
          </p>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        onClick={handleLogout} 
        variant="destructive" 
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sair da Conta
      </Button>
    </div>
  );
};

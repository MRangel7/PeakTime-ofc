import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/AuthLayout";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdmin) {
      // Admin login validation
      if (
        adminName === "ADMMML" &&
        adminCode === "PEAKTIME" &&
        email === "peaktimecorp@gmail.com" &&
        password === "PEAKTIME"
      ) {
        localStorage.setItem("userType", "admin");
        localStorage.setItem("userName", adminName);
        localStorage.setItem("userEmail", email);
        toast.success("Login de administrador realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error("Credenciais de administrador inválidas!");
      }
    } else {
      // User login (simplified - would use real auth in production)
      if (email && password) {
        localStorage.setItem("userType", "user");
        localStorage.setItem("userEmail", email);
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error("Por favor, preencha todos os campos!");
      }
    }
  };

  return (
    <AuthLayout 
      title="PeakTime"
      subtitle={isAdmin ? "Acesso Administrativo" : "Bem-vindo de volta"}
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {isAdmin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="adminName">Nome</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="Digite seu nome"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminCode">Código</Label>
              <Input
                id="adminCode"
                type="text"
                placeholder="Digite o código de acesso"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          Entrar
        </Button>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? "Entrar como Usuário" : "Entrar como ADM"}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/cadastro")}
          >
            Criar nova conta
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

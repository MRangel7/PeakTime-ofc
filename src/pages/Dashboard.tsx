import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, TrendingUp, User } from "lucide-react";
import { InicioTab } from "@/components/tabs/InicioTab";
import { PeakTimeTab } from "@/components/tabs/PeakTimeTab";
import { PerfilTab } from "@/components/tabs/PerfilTab";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"user" | "admin">("user");

  useEffect(() => {
    const type = localStorage.getItem("userType");
    if (!type) {
      navigate("/login");
    } else {
      setUserType(type as "user" | "admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="inicio" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-16 rounded-none border-b sticky top-0 bg-card/95 backdrop-blur z-50">
          <TabsTrigger value="inicio" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Início</span>
          </TabsTrigger>
          <TabsTrigger value="peaktime" className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="hidden sm:inline">PeakTime</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inicio" className="m-0">
          <InicioTab userType={userType} />
        </TabsContent>

        <TabsContent value="peaktime" className="m-0">
          <PeakTimeTab />
        </TabsContent>

        <TabsContent value="perfil" className="m-0">
          <PerfilTab userType={userType} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

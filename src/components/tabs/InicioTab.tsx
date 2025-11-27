import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Edit, Plus, Save, X, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface InicioTabProps {
  userType: "user" | "admin";
}

interface Patrocinador {
  id: number;
  name: string;
  url: string;
  emoji?: string;
  image?: string;
}

const patrocinadoresIniciais: Patrocinador[] = [
  { id: 1, name: "Nike", url: "https://www.nike.com.br", emoji: "👟" },
  { id: 2, name: "Adidas", url: "https://www.adidas.com.br", emoji: "⚽" },
  { id: 3, name: "Puma", url: "https://br.puma.com", emoji: "🐆" },
  { id: 4, name: "New Balance", url: "https://www.newbalance.com.br", emoji: "🏃" },
];

const eventosIniciais = [
  { id: 1, title: "Aula de Spinning", date: "2025-11-05", time: "18:00", description: "Aula intensa de spinning para todos os níveis" },
  { id: 2, title: "Treino Funcional", date: "2025-11-08", time: "19:00", description: "Treino funcional em grupo" },
  { id: 3, title: "Yoga ao Entardecer", date: "2025-11-10", time: "17:30", description: "Relaxamento e alongamento" },
];

const emojiOptions = [
  { emoji: "💪", label: "Braço" },
  { emoji: "🦵", label: "Perna" },
  { emoji: "🫀", label: "Peito" },
  { emoji: "🏋️", label: "Costas" },
  { emoji: "🏃", label: "Corrida" },
  { emoji: "👟", label: "Tênis" },
];

const treinosIniciais = [
  { id: 1, title: "Treino A - Peito/Tríceps", image: "💪", notes: "Supino reto 3x12\nSupino inclinado 3x10\nCrucifixo 3x12\nTríceps testa 3x12" },
  { id: 2, title: "Treino B - Costas/Bíceps", image: "🏋️", notes: "Barra fixa 3x10\nRemada curvada 3x12\nPuxada alta 3x12\nRosca direta 3x12" },
  { id: 3, title: "Treino C - Pernas", image: "🦵", notes: "Agachamento 4x12\nLeg press 3x15\nCadeira extensora 3x12\nCadeira flexora 3x12" },
  { id: 4, title: "Treino D - Ombros", image: "💪", notes: "Desenvolvimento 3x12\nElevação lateral 3x15\nElevação frontal 3x15\nRemada alta 3x12" },
];

export const InicioTab = ({ userType }: InicioTabProps) => {
  const [treinos, setTreinos] = useState(treinosIniciais);
  const [eventos, setEventos] = useState(eventosIniciais);
  const [selectedTreino, setSelectedTreino] = useState<typeof treinosIniciais[0] | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [novoEvento, setNovoEvento] = useState({ title: "", date: "", time: "", description: "" });
  const [dialogOpen, setDialogOpen] = useState<number | null>(null);
  const [editingEvento, setEditingEvento] = useState<typeof eventosIniciais[0] | null>(null);
  const [showAllTreinos, setShowAllTreinos] = useState(false);
   const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>(patrocinadoresIniciais);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [eventoStatus, setEventoStatus] = useState<{ [key: number]: "vou" | "nao" | null }>({});
  const [novoPatrocinador, setNovoPatrocinador] = useState<Patrocinador>({ 
    id: 0, 
    name: "", 
    url: "", 
    emoji: "🏆" 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % patrocinadores.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [patrocinadores.length]);

  const handleSaveTreino = () => {
    if (selectedTreino) {
      setTreinos(treinos.map(t => t.id === selectedTreino.id ? selectedTreino : t));
      toast.success("Treino atualizado com sucesso!");
      setSelectedTreino(null);
      setDialogOpen(null);
    }
  };

  const handleAddTreino = () => {
    if (treinos.length >= 8) {
      toast.error("Máximo de 8 treinos atingido!");
      return;
    }
    const newTreino = {
      id: treinos.length + 1,
      title: `Treino ${String.fromCharCode(65 + treinos.length)}`,
      image: "💪",
      notes: "Adicione seus exercícios aqui..."
    };
    setTreinos([...treinos, newTreino]);
    toast.success("Novo treino adicionado!");
  };

  const handleRemoveTreino = (id: number) => {
    if (treinos.length <= 3) {
      toast.error("Mínimo de 3 treinos necessários!");
      return;
    }
    setTreinos(treinos.filter(t => t.id !== id));
    toast.success("Treino removido!");
  };

  const handleAdminEditTreino = () => {
    if (editEmail && editPassword) {
      // In production, validate credentials
      toast.success("Acesso autorizado! Selecione um treino para editar.");
      setShowAllTreinos(true);
    } else {
      toast.error("Preencha e-mail e senha do aluno!");
    }
  };

  const handleAddEvento = () => {
    if (novoEvento.title && novoEvento.date && novoEvento.time) {
      if (editingEvento) {
        setEventos(eventos.map(e => e.id === editingEvento.id ? { ...editingEvento, ...novoEvento } : e));
        toast.success("Evento atualizado com sucesso!");
        setEditingEvento(null);
      } else {
        const newEvent = {
          id: eventos.length + 1,
          ...novoEvento
        };
        setEventos([...eventos, newEvent]);
        toast.success("Evento adicionado com sucesso!");
      }
      setNovoEvento({ title: "", date: "", time: "", description: "" });
    } else {
      toast.error("Preencha todos os campos obrigatórios!");
    }
  };

  const handleEditEvento = (evento: typeof eventosIniciais[0]) => {
    setEditingEvento(evento);
    setNovoEvento({
      title: evento.title,
      date: evento.date,
      time: evento.time,
      description: evento.description
    });
  };

  const handleRemoveEvento = (id: number) => {
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("Evento removido com sucesso!");
  };

const handleAddPatrocinador = () => {
    if (!novoPatrocinador.name || !novoPatrocinador.url) {
      toast.error("Preencha nome e URL do patrocinador!");
      return;
    }
    const newSponsor = {
      ...novoPatrocinador,
      id: patrocinadores.length + 1,
    };
    setPatrocinadores([...patrocinadores, newSponsor]);
    setNovoPatrocinador({ id: 0, name: "", url: "", emoji: "🏆" });
    setSponsorDialogOpen(false);
    toast.success("Patrocinador adicionado!");
  };

  const handleRemovePatrocinador = (id: number) => {
    setPatrocinadores(patrocinadores.filter(p => p.id !== id));
    toast.success("Patrocinador removido!");
  };

  const handleSponsorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoPatrocinador({ ...novoPatrocinador, image: reader.result as string, emoji: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const visibleSponsors = Array.from({ length: 3 }, (_, i) => 
    patrocinadores[(carouselIndex + i) % patrocinadores.length]
  );
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Patrocinadores */}
      <section>


        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Patrocinadores</h2>
          {userType === "admin" && (
            <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Patrocinador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Patrocinador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sponsor-name">Nome</Label>
                    <Input
                      id="sponsor-name"
                      value={novoPatrocinador.name}
                      onChange={(e) => setNovoPatrocinador({ ...novoPatrocinador, name: e.target.value })}
                      placeholder="Nome do patrocinador"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsor-url">URL</Label>
                    <Input
                      id="sponsor-url"
                      value={novoPatrocinador.url}
                      onChange={(e) => setNovoPatrocinador({ ...novoPatrocinador, url: e.target.value })}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsor-image">Imagem (opcional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sponsor-image"
                        type="file"
                        accept="image/*"
                        onChange={handleSponsorImageUpload}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNovoPatrocinador({ ...novoPatrocinador, image: undefined, emoji: "🏆" })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {novoPatrocinador.image && (
                      <img src={novoPatrocinador.image} alt="Preview" className="mt-2 h-20 w-20 object-contain" />
                    )}
                  </div>
                  <div>
                    <Label>Emoji (se não usar imagem)</Label>
                    <Input
                      value={novoPatrocinador.emoji || ""}
                      onChange={(e) => setNovoPatrocinador({ ...novoPatrocinador, emoji: e.target.value })}
                      placeholder="🏆"
                      maxLength={2}
                    />
                  </div>
                  <Button onClick={handleAddPatrocinador} className="w-full bg-gradient-primary">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleSponsors.map((sponsor) => (
            <div key={sponsor.id} className="relative group">
              <a 
                href={sponsor.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-gradient-card hover:shadow-glow transition-smooth cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-32 gap-2">
                    {sponsor.image ? (
                      <img src={sponsor.image} alt={sponsor.name} className="h-16 w-16 object-contain" />
                    ) : (
                      <span className="text-5xl">{sponsor.emoji}</span>
                    )}
                    <span className="font-semibold">{sponsor.name}</span>
                  </CardContent>
                </Card>
              </a>
              {userType === "admin" && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePatrocinador(sponsor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>


          ))}
        </div>
      </section>

      {/* Blocos de Treino / Editar Treino */}
      <section>
        {userType === "user" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Meus Treinos</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddTreino} 
                  className="bg-gradient-primary"
                  disabled={treinos.length >= 8}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Treino
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {treinos.map((treino) => (
                <div key={treino.id} className="relative group">
                  <Dialog 
                    open={dialogOpen === treino.id} 
                    onOpenChange={(open) => {
                      if (open) {
                        setDialogOpen(treino.id);
                        setSelectedTreino(treino);
                      } else {
                        setDialogOpen(null);
                        setSelectedTreino(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-glow hover:border-accent transition-smooth">
                        <CardContent className="p-6 text-center space-y-2">
                          <div className="text-5xl mb-2">{treino.image}</div>
                          <h3 className="font-semibold">{treino.title}</h3>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>


                       <DialogTitle>Editar Treino</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Título do Treino</Label>
                          <Input
                            value={selectedTreino?.title || ""}
                            onChange={(e) => setSelectedTreino(selectedTreino ? { ...selectedTreino, title: e.target.value } : null)}
                            placeholder="Nome do treino"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Imagem do Treino</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {emojiOptions.map((option) => (
                              <Button
                                key={option.label}
                                type="button"
                                variant={selectedTreino?.image === option.emoji ? "default" : "outline"}
                                className="h-16 text-3xl"
                                onClick={() => setSelectedTreino(selectedTreino ? { ...selectedTreino, image: option.emoji } : null)}
                              >
                                {option.emoji}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Exercícios</Label>
                          <Textarea
                            value={selectedTreino?.notes || ""}
                            onChange={(e) => setSelectedTreino(selectedTreino ? { ...selectedTreino, notes: e.target.value } : null)}
                            rows={10}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSaveTreino} className="flex-1 bg-gradient-primary">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </Button>
                        {treinos.length > 3 && (
                          <Button 
                            onClick={() => {
                              handleRemoveTreino(treino.id);
                              setDialogOpen(null);
                            }} 
                            variant="destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Editar Treino de Aluno</h2>
            <Card className="bg-gradient-card">
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail do Aluno</Label>
                    <Input
                      type="email"
                      placeholder="aluno@email.com"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha do Aluno</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAdminEditTreino} className="w-full bg-gradient-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Acessar Treino
                </Button>
              </CardContent>
            </Card>

            {showAllTreinos && (
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-lg">Selecione um treino para editar:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {treinos.map((treino) => (
                    <Card 
                      key={treino.id} 
                      className="cursor-pointer hover:shadow-glow hover:border-accent transition-smooth"
                      onClick={() => {
                        setSelectedTreino(treino);
                        setShowAllTreinos(false);
                      }}
                    >
                      <CardContent className="p-6 text-center space-y-2">
                        <div className="text-5xl mb-2">{treino.image}</div>
                        <h3 className="font-semibold">{treino.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTreino && !showAllTreinos && (
              <Card className="mt-4">
                <CardContent className="p-6 space-y-4">


                 <div className="space-y-2">
                    <Label>Título do Treino</Label>
                    <Input
                      value={selectedTreino.title}
                      onChange={(e) => setSelectedTreino({ ...selectedTreino, title: e.target.value })}
                      placeholder="Nome do treino"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Imagem do Treino</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {emojiOptions.map((option) => (
                        <Button
                          key={option.label}
                          type="button"
                          variant={selectedTreino.image === option.emoji ? "default" : "outline"}
                          className="h-16 text-3xl"
                          onClick={() => setSelectedTreino({ ...selectedTreino, image: option.emoji })}
                        >
                          {option.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Exercícios</Label>
                    <Textarea
                      value={selectedTreino.notes}
                      onChange={(e) => setSelectedTreino({ ...selectedTreino, notes: e.target.value })}
                      rows={10}
                      className="font-mono"
                    />
                  </div>


                  <div className="flex gap-2">
                    <Button onClick={handleSaveTreino} className="flex-1 bg-gradient-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button onClick={() => {
                      setSelectedTreino(null);
                      setShowAllTreinos(true);
                    }} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      {/* Próximos Eventos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Próximos Eventos</h2>
          {userType === "admin" && (
            <Dialog open={!!editingEvento || undefined} onOpenChange={(open) => {
              if (!open) {
                setEditingEvento(null);
                setNovoEvento({ title: "", date: "", time: "", description: "" });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvento ? "Editar Evento" : "Adicionar Novo Evento"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={novoEvento.title}
                      onChange={(e) => setNovoEvento({ ...novoEvento, title: e.target.value })}
                      placeholder="Nome do evento"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={novoEvento.date}
                        onChange={(e) => setNovoEvento({ ...novoEvento, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input
                        type="time"
                        value={novoEvento.time}
                        onChange={(e) => setNovoEvento({ ...novoEvento, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={novoEvento.description}
                      onChange={(e) => setNovoEvento({ ...novoEvento, description: e.target.value })}
                      placeholder="Descrição do evento"
                    />
                  </div>
                  <Button onClick={handleAddEvento} className="w-full bg-gradient-primary">
                    <Save className="w-4 h-4 mr-2" />
                    {editingEvento ? "Salvar Alterações" : "Adicionar Evento"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eventos.map((evento) => {
            const [year, month, day] = evento.date.split('-').map(Number);
            const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
            
            return (
              <Card key={evento.id} className="bg-gradient-card hover:shadow-card transition-smooth relative group">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-accent">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">
                      {dateStr} às {evento.time}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{evento.title}</h3>
                  <p className="text-muted-foreground text-sm">{evento.description}</p>
                  
                  {userType === "user" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">

  {/* BOTÃO VOU */}
  <Button
    variant="outline"
    className={`flex-1 border-green-500 
      ${eventoStatus[evento.id] === "vou"
        ? "bg-green-500 text-white"
        : "text-green-500 hover:bg-green-500 hover:text-white"}
    `}
    onClick={() =>
      setEventoStatus(prev => ({
        ...prev,
        [evento.id]:
          prev[evento.id] === "vou" ? null : "vou"   // 👈 AQUI REMOVE SE CLICAR DE NOVO
      }))
    }
  >
    Vou
  </Button>

  {/* BOTÃO NÃO VOU */}
  <Button
    variant="outline"
    className={`flex-1 border-red-500 
      ${eventoStatus[evento.id] === "nao"
        ? "bg-red-500 text-white"
        : "text-red-500 hover:bg-red-500 hover:text-white"}
    `}
    onClick={() =>
      setEventoStatus(prev => ({
        ...prev,
        [evento.id]:
          prev[evento.id] === "nao" ? null : "nao"   // 👈 AQUI TAMBÉM REMOVE SE CLICAR DE NOVO
      }))
    }
  >
    Não vou
  </Button>
  
</div>



                  )}

                  {userType === "admin" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditEvento(evento)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleRemoveEvento(evento.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

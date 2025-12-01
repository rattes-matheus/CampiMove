'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserX, PlusCircle, CheckCircle, MoreVertical, Edit, Trash, Ban } from 'lucide-react';

const initialUsers = [
  { id: 'user-1', name: 'João da Silva', email: 'joao.silva@exemplo.com' },
  { id: 'user-2', name: 'Maria Souza', email: 'maria.souza@exemplo.com' },
  { id: 'user-3', name: 'Pedro Santos', email: 'pedro.santos@exemplo.com' },
];

const initialReports = [
  { id: 'rep-1', reportedMotorist: 'João da Silva', reporter: 'Ana Clara', reason: 'Direção perigosa e velocidade excessiva.' },
  { id: 'rep-2', reportedMotorist: 'Samuel Wilson', reporter: 'Bruno Lima', reason: 'Veículo em más condições de higiene.' },
];

interface RouteResponse {
  id: number;
  route: string;
  schedule: string;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [users, setUsers] = useState(initialUsers);
  const [reports, setReports] = useState(initialReports);
  const [notification, setNotification] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newTime, setNewTime] = useState('');

  // 🔹 NOVO: Estados para edição
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [editRoute, setEditRoute] = useState('');
  const [editTime, setEditTime] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 🔹 Função para buscar horários
  const fetchSchedules = () => {
    fetch("http://localhost:8080/api/routes")
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("Dados recebidos do backend:", data);

          const list = Array.isArray(data)
              ? data
              : Array.isArray(data.data)
                  ? data.data
                  : [];

          const formatted = list.map((r: any) => ({
            id: r.id,
            route: r.route,
            time: r.schedule
          }));

          setSchedules(formatted);
        })
        .catch(err => {
          console.error("Erro ao carregar horários:", err);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os horários do servidor.",
            variant: "destructive"
          });
        });
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 🔹 Adicionar horário no banco
  const handleAddSchedule = async () => {
    if (newRoute && newTime) {
      try {
        console.log("Enviando dados:", { route: newRoute, schedule: newTime });

        const response = await fetch("http://localhost:8080/api/routes/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ route: newRoute, schedule: newTime }),
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const saved: RouteResponse = await response.json();

            if (saved && saved.id && saved.route && saved.schedule) {
              setSchedules([...schedules, {
                id: saved.id,
                route: saved.route,
                time: saved.schedule
              }]);
              toast({
                title: "Sucesso",
                description: "Novo horário salvo no banco."
              });
            } else {
              fetchSchedules();
              toast({
                title: "Sucesso",
                description: "Novo horário salvo no banco."
              });
            }
          } else {
            fetchSchedules();
            toast({
              title: "Sucesso",
              description: "Novo horário salvo no banco."
            });
          }

          setNewRoute("");
          setNewTime("");
        } else {
          const errorText = await response.text();
          console.error("Erro do backend:", errorText);
          toast({
            title: "Erro",
            description: errorText || "Falha ao salvar no banco.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
        toast({
          title: "Erro",
          description: "Falha ao conectar ao servidor.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Preencha a rota e o horário.",
        variant: "destructive"
      });
    }
  };

  // 🔹 Remover horário do banco
  const handleRemoveSchedule = async (id: number) => {
    try {
      const response = await fetch("http://localhost:8080/api/routes/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSchedules(schedules.filter(s => s.id !== id));
        toast({ title: "Sucesso", description: "Horário removido do banco." });
      } else {
        const errorText = await response.text();
        toast({
          title: "Erro",
          description: errorText || "Falha ao excluir no banco.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao conectar ao servidor.",
        variant: "destructive"
      });
    }
  };

  // 🔹 NOVO: Deletar TODOS os horários
  const handleDeleteAllSchedules = async () => {
    if (!confirm("Tem certeza que deseja excluir TODOS os horários? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/routes/delete-all", {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        },
      });

      if (response.ok) {
        setSchedules([]);
        toast({ title: "Sucesso", description: "Todos os horários foram excluídos." });
      } else {
        const errorText = await response.text();
        toast({
          title: "Erro",
          description: errorText || "Falha ao excluir todos os horários.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao conectar ao servidor.",
        variant: "destructive"
      });
    }
  };

  // 🔹 NOVO: Abrir modal de edição
  const handleOpenEditDialog = (schedule: any) => {
    setEditingRoute(schedule);
    setEditRoute(schedule.route);
    // Converte "HH:mm:ss" para "HH:mm" para o input time
    setEditTime(schedule.time.split(':').slice(0, 2).join(':'));
    setIsEditDialogOpen(true);
  };

  // 🔹 NOVO: Salvar edição
  const handleSaveEdit = async () => {
    if (!editRoute || !editTime) {
      toast({
        title: "Erro",
        description: "Preencha a rota e o horário.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/routes/update/${editingRoute.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          route: editRoute,
          schedule: editTime
        }),
      });

      if (response.ok) {
        const updated: RouteResponse = await response.json();

        // Atualiza a lista local
        setSchedules(schedules.map(s =>
            s.id === editingRoute.id
                ? { ...s, route: updated.route, time: updated.schedule }
                : s
        ));

        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
        setIsEditDialogOpen(false);
      } else {
        const errorText = await response.text();
        toast({
          title: "Erro",
          description: errorText || "Falha ao atualizar horário.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao conectar ao servidor.",
        variant: "destructive"
      });
    }
  };

  const handleDismissReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
    toast({ title: 'Sucesso', description: 'Denúncia dispensada.' });
  };

  const handleSendNotification = () => {
    if (notification.trim()) {
      console.log("Enviando notificação:", notification);
      toast({ title: 'Sucesso', description: 'Notificação enviada para todos os usuários.' });
      setNotification('');
    } else {
      toast({ title: 'Erro', description: 'A mensagem da notificação não pode estar vazia.', variant: 'destructive' });
    }
  };

  const handleBanUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setUsers(users.filter(u => u.id !== id));
      toast({ title: 'Sucesso', description: `Usuário ${user.name} foi banido.` });
    }
  };

  return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Painel do Administrador</h1>
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">

            {/* 🔹 GERENCIAR HORÁRIOS DO INTERCAMPUS */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Horários do Intercampus</CardTitle>
                <CardDescription>Adicione, edite ou remova horários dos ônibus.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2" /> Adicionar Horário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Horário</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="route" className="text-right">Rota</Label>
                          <Input
                              id="route"
                              value={newRoute}
                              onChange={(e) => setNewRoute(e.target.value)}
                              className="col-span-3"
                              placeholder="Ex: Campus I -> Campus II"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">Horário</Label>
                          <Input
                              id="time"
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" onClick={handleAddSchedule}>Salvar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* 🔹 NOVO: Botão para excluir todos */}
                  <Button variant="destructive" onClick={handleDeleteAllSchedules}>
                    <Trash className="mr-2" /> Excluir Todos
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rota</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            Nenhum horário cadastrado ainda.
                          </TableCell>
                        </TableRow>
                    ) : (
                        schedules.map(schedule => (
                            <TableRow key={schedule.id}>
                              <TableCell>{schedule.route}</TableCell>
                              <TableCell>{schedule.time.split(':').slice(0, 2).join(':')}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {/* 🔹 NOVO: Menu de 3 pontos */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleOpenEditDialog(schedule)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => handleRemoveSchedule(schedule.id)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 🔸 MODAL DE EDIÇÃO */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Horário</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-route" className="text-right">Rota</Label>
                    <Input
                        id="edit-route"
                        value={editRoute}
                        onChange={(e) => setEditRoute(e.target.value)}
                        className="col-span-3"
                        placeholder="Ex: Campus I -> Campus II"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-time" className="text-right">Horário</Label>
                    <Input
                        id="edit-time"
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 🔸 RESTANTE DO CÓDIGO MANTIDO */}
            {/* Enviar Notificação */}
            <Card>
              <CardHeader>
                <CardTitle>Enviar Notificação</CardTitle>
                <CardDescription>Envie uma mensagem para todos os usuários.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                    placeholder="Digite sua mensagem de notificação aqui..."
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                    rows={5}
                />
                <Button className="w-full" onClick={handleSendNotification}>Enviar Notificação</Button>
              </CardContent>
            </Card>

            {/* Denúncias */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Denúncias de Usuários</CardTitle>
                <CardDescription>Gerencie denúncias feitas contra motoristas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motorista Denunciado</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.reportedMotorist}</TableCell>
                          <TableCell className="text-muted-foreground">{report.reason}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDismissReport(report.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Dispensar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => {
                              const userToBan = users.find(u => u.name === report.reportedMotorist);
                              if (userToBan) handleBanUser(userToBan.id);
                              handleDismissReport(report.id);
                            }}>
                              <UserX className="mr-2 h-4 w-4" /> Banir
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Usuários */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>Visualize e bana usuários do sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleBanUser(user.id)}>
                              <UserX className="mr-2 h-4 w-4" /> Banir
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
  );
}
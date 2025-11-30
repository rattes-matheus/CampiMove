'use client';

import BusSchedule from '@/lib/interfaces/BusSchedule';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserX, PlusCircle, ShieldX, CheckCircle } from 'lucide-react';
import axios from "axios";

type UserReport = {
  id: number;
  userid: number;
  driverName: string;
  report_text: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [notification, setNotification] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newTime, setNewTime] = useState('');
  const [modified, setModified] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      let token = null;
      if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

      const res = await axios.get("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userRole = res.data.role;

      if (userRole === "STUDENT" || userRole === "TEACHER") return router.push("/dashboard");
      if (userRole === "DRIVER") return router.push("/dashboard/motorist");

      axios.get<BusSchedule[]>("http://localhost:8080/api/routes")
        .then((res) => setSchedules(res.data))
        .catch((err) => console.log("Erro ao buscar intercampis:", err.message));
    };

    axios.get("http://localhost:8080/api/admin/reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.log("Erro ao buscar reports:", err.message));

    axios.get("http://localhost:8080/api/admin/show-users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Erro ao buscar usuários:", err.message));

    fetchData();
  }, [modified, router]);

  const handleAddSchedule = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return router.push("/login");

    if (newRoute && newTime) {
      axios.post("http://localhost:8080/api/routes", {
        route: newRoute,
        schedule: newTime + ":00"
      }).then(() => {
        toast({ title: 'Sucesso', description: 'Novo horário adicionado.' });
        setModified(modified + 1);
      }).catch(() => {
        toast({ title: 'Erro', description: 'Erro ao criar o horário.', variant: 'destructive' });
      }).finally(() => {
        setNewRoute('');
        setNewTime('');
      });
    } else {
      toast({ title: 'Erro', description: 'Preencha rota e horário.', variant: 'destructive' });
    }
  };

  const handleRemoveSchedule = (id: number) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return router.push("/login");

    axios.post("http://localhost:8080/api/routes/delete", { id })
      .then(() => {
        toast({ title: 'Sucesso', description: 'Horário removido.' });
        setModified(modified + 1);
      })
      .catch(() => {
        toast({ title: 'Erro', description: 'Erro ao remover horário.', variant: 'destructive' });
      });
  };

  const handleDismissReport = (id: number) => {
    axios.delete(`http://localhost:8080/api/admin/reports/actions/${id}/ignore`)
      .then(() => {
        toast({ title: "Sucesso", description: "Denúncia removida." });
        setModified(modified + 1);
      })
      .catch(() => {
        toast({ title: 'Erro', description: 'Erro ao deletar denúncia.', variant: 'destructive' });
      });
  };

  const handleSendNotification = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return router.push("/login");

    if (notification.trim()) {
      toast({ title: 'Sucesso', description: 'Notificação enviada.' });
      setNotification('');
    } else {
      toast({ title: 'Erro', description: 'A notificação não pode estar vazia.', variant: 'destructive' });
    }
  };

  const handleBanUserFromReport = (reportId: number, userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/${reportId}/disable-from-report`)
      .then(() => {
        toast({ title: "Sucesso", description: "Usuário banido." });
        setModified(modified + 1);
      }).catch(() => {
        toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
      });
  };

  const handleBanUser = (userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/disable-user`)
      .then(() => {
        toast({ title: "Sucesso", description: "Usuário banido." });
        setModified(prev => prev + 1);
      }).catch(() => {
        toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
      });
  };

  const handleUnbanUser = (userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/enable-user`)
      .then(() => {
        toast({ title: "Sucesso", description: "Usuário reativado." });
        setModified(prev => prev + 1);
      }).catch(() => {
        toast({ title: 'Erro', description: 'Erro ao reativar usuário.', variant: 'destructive' });
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel do Administrador</h1>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">

          {/* HORÁRIOS */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Horários do Intercampus</CardTitle>
              <CardDescription>Adicione ou remova horários.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2" /> Adicionar Horário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Horário</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="route" className="text-right">Rota</Label>
                        <Input id="route" value={newRoute} onChange={(e) => setNewRoute(e.target.value)} className="col-span-3" />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">Horário</Label>
                        <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="col-span-3" />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" onClick={handleAddSchedule}>Salvar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rota</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map(schedule => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.route}</TableCell>
                      <TableCell>{schedule.schedule}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSchedule(schedule.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </CardContent>
          </Card>

          {/* NOTIFICAÇÕES */}
          <Card>
            <CardHeader>
              <CardTitle>Enviar Notificação</CardTitle>
              <CardDescription>Mensagem global para todos os usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                rows={5}
              />
              <Button className="w-full" onClick={handleSendNotification}>Enviar</Button>
            </CardContent>
          </Card>

          {/* DENÚNCIAS */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Denúncias</CardTitle>
              <CardDescription>Gerencie denúncias contra motoristas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motorista</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map(report => (
                      <TableRow key={report.id}>
                        <TableCell>{report.driverName}</TableCell>
                        <TableCell>{report.report_text}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDismissReport(report.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Dispensar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleBanUserFromReport(report.id, report.userid)}>
                            <UserX className="mr-2 h-4 w-4" /> Banir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* USUÁRIOS */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Banir ou reativar usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-y-auto">
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

                          {user.role === "ADMIN" ? (
                            <Button variant="secondary" size="sm" disabled>
                              <ShieldX className="mr-2 h-4 w-4" /> Admin
                            </Button>
                          ) : user.active ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <UserX className="mr-2 h-4 w-4" /> Banir
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUnbanUser(user.id)}
                            >
                              Reativar
                            </Button>
                          )}

                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}

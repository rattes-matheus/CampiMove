
'use client';

import BusSchedule from '@/lib/interfaces/BusSchedule';

import { useEffect, useState } from 'react';
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

const initialUsers = [
  { id: 'user-1', name: 'João da Silva', email: 'joao.silva@exemplo.com' },
  { id: 'user-2', name: 'Maria Souza', email: 'maria.souza@exemplo.com' },
  { id: 'user-3', name: 'Pedro Santos', email: 'pedro.santos@exemplo.com' },
];

const initialReports = [
    { id: 'rep-1', reportedMotorist: 'João da Silva', reporter: 'Ana Clara', reason: 'Direção perigosa e velocidade excessiva.'},
    { id: 'rep-2', reportedMotorist: 'Samuel Wilson', reporter: 'Bruno Lima', reason: 'Veículo em más condições de higiene.'},
];

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [users, setUsers] = useState(initialUsers);
  const [reports, setReports] = useState(initialReports);
  const [notification, setNotification] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newTime, setNewTime] = useState('');
  const [modified, setModified] = useState(0);

  useEffect(() => {
    axios.get<BusSchedule[]>("http://localhost:8080/api/routes").then((res) => {
      setSchedules(res.data)
    }).catch((err: Error) => console.log("Can't GET the avaible intercampis : ", err.message));
  }, [modified]);

  const handleAddSchedule = () => {
    if (newRoute && newTime) {
      axios.post("http://localhost:8080/api/routes", {
        route: newRoute,
        schedule: newTime + ":00"
      }).then(() => {
        toast({ title: 'Sucesso', description: 'Novo horário adicionado.' });
        setModified(modified+1);
      }).catch((err: Error) => {
          toast({ title: 'Erro', description: 'Erro ao criar o novo horario de Intercampi', variant: 'destructive' });  
          console.log("Can't create a new Bus Schedule : ", err.message);
        }
      ).finally(() => {
        setNewRoute('');
        setNewTime('');
      });
    } else {
      toast({ title: 'Erro', description: 'Preencha a rota e o horário.', variant: 'destructive' });
    }
  };

  const handleRemoveSchedule = (id: number) => {
    axios.post("http://localhost:8080/api/routes/delete", {
      id: id
    }).then(() => {
      toast({ title: 'Sucesso', description: 'Horário removido.' })
      setModified(modified+1);
    })
    .catch((err) => {
        toast({ title: 'Erro', description: 'Erro ao deletar o horario de Intercampi', variant: 'destructive' });  
        console.log("Can't delete the Bus Schedule : ", err.message);
    })
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
    if(user){
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
          {/* Gerenciar Horários */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Horários do Intercampus</CardTitle>
              <CardDescription>Adicione ou remova horários dos ônibus.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
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
                        <Input id="route" value={newRoute} onChange={(e) => setNewRoute(e.target.value)} className="col-span-3" placeholder="Ex: Campus I -> Campus II" />
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

          {/* Gerenciar Denúncias */}
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
                        <Button variant="destructive" size="sm" onClick={() => {/* Lógica para banir baseada no nome */
                           const userToBan = users.find(u => u.name === report.reportedMotorist);
                           if(userToBan) handleBanUser(userToBan.id);
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

          {/* Gerenciar Usuários */}
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

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

import { CalendarDays } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserX, PlusCircle, ShieldX, CheckCircle, Pencil } from 'lucide-react';
import axios from "axios";

type Notice = {
    id: number;
    title: string;
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    active: boolean;
    date: string;
};


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
    const [notificationTitle, setNotificationTitle] = useState('');
    const [newRoute, setNewRoute] = useState('');
    const [newTime, setNewTime] = useState('');
    const [modified, setModified] = useState(0);
    const [timeValue, setTimeValue] = useState<number>(1)
    const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("minutes");
    const router = useRouter();
    const [notificationTarget, setNotificationTarget] =
        useState<"ALL" | "STUDENTS" | "PROFESSORS">("ALL");
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');
    const [noticePriority, setNoticePriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [notices, setNotices] = useState<Notice[]>([]);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);



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

            axios.get<BusSchedule[]>("http://localhost:8080/horarios-onibus")
                .then((res) => setSchedules(res.data))
                .catch((err) => console.log("Erro ao buscar intercampis:", err.message));
        };

        axios.get("http://localhost:8080/api/admin/reports")
            .then((res) => setReports(res.data))
            .catch((err) => console.log("Erro ao buscar reports:", err.message));

        axios.get("http://localhost:8080/api/admin/show-users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log("Erro ao buscar usuários:", err.message));

        axios.get<Notice[]>("http://localhost:8080/api/notices/get")
            .then(res => setNotices(res.data))
            .catch(() => console.log("Erro ao buscar avisos"));


        fetchData();
    }, [modified, router]);

    const handleAddSchedule = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return router.push("/login");

        if (newRoute && newTime) {
            axios.post("http://localhost:8080/horarios-onibus", {
                origem: newRoute,
                horario: newTime
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

        axios.delete(`http://localhost:8080/horarios-onibus/${id}`)
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

        if (!notificationTitle.trim() || !notification.trim() || !timeValue) {
            return toast({
                title: "Erro",
                description: "Preencha título, mensagem e tempo.",
                variant: "destructive"
            });
        }


        axios.post("http://localhost:8080/api/notifications", {
            title: notificationTitle,
            message: notification,
            programmedTime: timeValue,
            timeUnit: timeUnit.toUpperCase(),
            target: notificationTarget
        })
            .then(() => {
                toast({ title: "Sucesso", description: "Notificação enviada." });

                setNotification("");
                setNotificationTitle("");
                setTimeValue(1);
                setTimeUnit("minutes");
                setModified(prev => prev + 1);
            })
            .catch(() => {
                toast({
                    title: "Erro",
                    description: "Falha ao enviar notificação.",
                    variant: "destructive"
                });
            });
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

    const handleSendNotice = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return router.push("/login");

        if (!noticeTitle.trim() || !noticeMessage.trim()) {
            return toast({
                title: "Erro",
                description: "Título e mensagem são obrigatórios.",
                variant: "destructive"
            });
        }

        axios.post(
            "http://localhost:8080/api/notices/send",
            {
                title: noticeTitle,
                message: noticeMessage,
                priority: noticePriority
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                toast({ title: "Sucesso", description: "Aviso enviado com sucesso." });
                setNoticeTitle('');
                setNoticeMessage('');
                setNoticePriority('MEDIUM');
                setNotices(prev => [res.data, ...prev]);

            })
            .catch(() => {
                toast({
                    title: "Erro",
                    description: "Falha ao enviar aviso.",
                    variant: "destructive"
                });
            });
    };
    const handleDeleteNotice = (id: number) => {
        const token = localStorage.getItem('jwt_token');

        axios.delete(`http://localhost:8080/api/notices/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                toast({ title: "Sucesso", description: "Aviso desativado" });
                setModified(prev => prev + 1);
            })
            .catch(() => {
                toast({
                    title: "Erro",
                    description: "Erro ao desativar aviso",
                    variant: "destructive"
                });
            });
    };
    const handleUpdateNotice = () => {
        if (!editingNotice) return;

        const token = localStorage.getItem('jwt_token');

        axios.put(
            `http://localhost:8080/api/notices/update/${editingNotice.id}`,
            {
                title: editingNotice.title,
                message: editingNotice.message,
                priority: editingNotice.priority
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
            .then(() => {
                toast({ title: "Sucesso", description: "Aviso atualizado" });
                setEditingNotice(null);
                setModified(prev => prev + 1);
            })
            .catch(() => {
                toast({
                    title: "Erro",
                    description: "Erro ao atualizar aviso",
                    variant: "destructive"
                });
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
                                                <Label htmlFor="route" className="text-right">Origem</Label>
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
                                            <TableCell>{schedule.origem}</TableCell>
                                            <TableCell>{schedule.horario}</TableCell>
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
                            <CardDescription>Envie notificações para todos ou para grupos específicos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Título da notificação"
                                    value={notificationTitle}
                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                />

                                <Textarea
                                    placeholder="Mensagem..."
                                    value={notification}
                                    onChange={(e) => setNotification(e.target.value)}
                                    rows={5}
                                />

                                <div className="flex items-center gap-2">



                                    {/* GRUPO DE BOTÕES */}
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Programar para:</Label>

                                        <div className="flex items-center gap-3">

                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={timeValue}
                                                    onChange={(e) => setTimeValue(Number(e.target.value))}
                                                    className="w-24 text-center rounded-lg"
                                                />
                                            </div>

                                            {/* GRUPO DE BOTÕES */}
                                            <div className="flex overflow-hidden rounded-md border border-gray-300">

                                                <button
                                                    className={`px-3 py-2 text-sm transition ${timeUnit === "minutes"
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                    onClick={() => setTimeUnit("minutes")}
                                                    type="button"
                                                >
                                                    Min
                                                </button>

                                                <button
                                                    className={`px-3 py-2 text-sm transition border-l border-gray-300 ${timeUnit === "hours"
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                    onClick={() => setTimeUnit("hours")}
                                                    type="button"
                                                >
                                                    Hor
                                                </button>

                                                <button
                                                    className={`px-3 py-2 text-sm transition border-l border-gray-300 ${timeUnit === "days"
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                    onClick={() => setTimeUnit("days")}
                                                    type="button"
                                                >
                                                    Dias
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">
                                            Enviar para:
                                        </Label>

                                        <Select
                                            value={notificationTarget}
                                            onValueChange={(value) =>
                                                setNotificationTarget(value as "ALL" | "STUDENTS" | "PROFESSORS")
                                            }
                                        >
                                            <SelectTrigger className="w-full focus:ring-orange-500">
                                                <SelectValue placeholder="Enviar para" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="ALL">Todos os usuários</SelectItem>
                                                <SelectItem value="STUDENTS">Apenas alunos</SelectItem>
                                                <SelectItem value="PROFESSORS">Apenas professores</SelectItem>
                                                <SelectItem value="DRIVERS">Apenas motoristas</SelectItem>
                                                <SelectItem value="STUDENTS_AND_PROFESSORS">
                                                    Alunos e professores
                                                </SelectItem>
                                            </SelectContent>

                                        </Select>
                                    </div>

                                </div>


                                <Button className="w-full" onClick={handleSendNotification}>
                                    Enviar
                                </Button>
                            </CardContent>

                        </CardContent>
                    </Card>
                    {/* INCIDENTES */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Incidentes Ocorridos</CardTitle>
                            <CardDescription>
                                Visualize e acompanhe registros de incidentes reportados.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                Aqui você pode consultar todos os incidentes relatados no sistema.
                            </div>

                            <Button
                                onClick={() => router.push("/dashboard/admin/report")}
                                className="flex items-center gap-2"
                            >
                                Ver Incidentes
                            </Button>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <CalendarDays className="text-orange-500" />

                            <div>
                                <CardTitle>
                                    Enviar Aviso
                                </CardTitle>
                                <CardDescription>
                                    Avisos institucionais para os usuários
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Título do aviso"
                                value={noticeTitle}
                                onChange={(e) => setNoticeTitle(e.target.value)}
                            />

                            <Textarea
                                placeholder="Mensagem do aviso"
                                value={noticeMessage}
                                onChange={(e) => setNoticeMessage(e.target.value)}
                                rows={4}
                            />

                            <div className="space-y-2">
                                <Label>Prioridade</Label>
                                <Select
                                    value={noticePriority}
                                    onValueChange={(value) =>
                                        setNoticePriority(value as 'LOW' | 'MEDIUM' | 'HIGH')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="LOW">Baixa</SelectItem>
                                        <SelectItem value="MEDIUM">Média</SelectItem>
                                        <SelectItem value="HIGH">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" onClick={handleSendNotice}>
                                Enviar Aviso
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Avisos Publicados</CardTitle>
                            <CardDescription>Editar ou desativar avisos</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="max-h-80 overflow-y-auto pr-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Mensagem</TableHead>
                                            <TableHead>Prioridade</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {notices.map(notice => (
                                            <TableRow key={notice.id}>
                                                <TableCell className="font-medium">{notice.title}</TableCell>

                                                <TableCell className="max-w-sm truncate">
                                                    {notice.message}
                                                </TableCell>

                                                <TableCell>
                                                    {notice.priority === 'HIGH' && '🔴 Alta'}
                                                    {notice.priority === 'MEDIUM' && '🟠 Média'}
                                                    {notice.priority === 'LOW' && '🟢 Baixa'}
                                                </TableCell>

                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingNotice(notice)}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteNotice(notice.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Desativar
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Aviso</DialogTitle>
                            </DialogHeader>

                            {editingNotice && (
                                <div className="space-y-4">
                                    <Input
                                        value={editingNotice.title}
                                        onChange={(e) =>
                                            setEditingNotice({ ...editingNotice, title: e.target.value })
                                        }
                                    />

                                    <Textarea
                                        rows={4}
                                        value={editingNotice.message}
                                        onChange={(e) =>
                                            setEditingNotice({ ...editingNotice, message: e.target.value })
                                        }
                                    />

                                    <Select
                                        value={editingNotice.priority}
                                        onValueChange={(value) =>
                                            setEditingNotice({
                                                ...editingNotice,
                                                priority: value as 'LOW' | 'MEDIUM' | 'HIGH'
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="LOW">Baixa</SelectItem>
                                            <SelectItem value="MEDIUM">Média</SelectItem>
                                            <SelectItem value="HIGH">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <DialogFooter>
                                <Button onClick={handleUpdateNotice}>
                                    Salvar alterações
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>



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
// frontend/src/app/dashboard/admin/reports/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, notFound } from "next/navigation";
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
    FileText, ArrowLeft, User, ClipboardList, Clock, MessageSquare, History, Save, Calendar, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { getReportDetails, updateReport, addResolutionNote } from '@/services/reportService';
import { ReportResponse, ReportNoteRequest, ReportStatus, ReportCategory } from '@/types/reports';

const STATUS_DISPLAY_MAP = {
    'ABERTO': 'ABERTO',
    'EM_ANALISE': 'EM ANÁLISE', 
    'RESOLVIDO': 'RESOLVIDO',
    'FECHADO': 'FECHADO',
};

const getStatusColor = (status: ReportStatus) => {
    switch (status) {
        case 'ABERTO': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'EM_ANALISE': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
        case 'RESOLVIDO': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'FECHADO': return 'bg-gray-500 hover:bg-gray-600 text-white';
        default: return 'bg-gray-200';
    }
};

const formatCategoryText = (category: ReportCategory) => {
    return category.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function AdminReportDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const reportId = Number(params.id); 

    const [report, setReport] = useState<ReportResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newNote, setNewNote] = useState('');
    const [currentStatus, setCurrentStatus] = useState<ReportStatus | undefined>(undefined);

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getReportDetails(reportId);
            setReport(result);
            setCurrentStatus(result.status); 
        } catch (e: any) {
            console.error("Erro ao buscar detalhes:", e);
            if (e.response && e.response.status === 404) {
                // Se o backend retornar 404, usei o notFound do Next.js
                notFound(); 
            } else {
                setError("Não foi possível carregar os detalhes do Report. Verifique a conexão com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reportId) {
            fetchReport();
        }
    }, [reportId]);

    const handleUpdateReport = async () => {
        if (!report || !currentStatus) return;

        const isStatusChanged = currentStatus !== report.status;
        const isNoteAdded = newNote.trim().length > 0;

        if (!isStatusChanged && !isNoteAdded) {
             toast({ title: "Nenhuma alteração", description: "O status é o mesmo e nenhuma nova nota foi adicionada.", variant: "default" });
             return;
        }

        try {
            let updatedReport = report;
            if (isStatusChanged) {
                updatedReport = await updateReport(reportId, { status: currentStatus });
            }

            if (isNoteAdded) {
                const noteRequest: ReportNoteRequest = { note: newNote.trim() };
                updatedReport = await addResolutionNote(reportId, noteRequest);
                setNewNote('');
            }
            
            setReport(updatedReport);
            setCurrentStatus(updatedReport.status); 

            toast({ title: "Sucesso!", description: "Report atualizado e notas salvas.", });
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            toast({ title: "Erro", description: "Falha ao salvar as alterações no Report.", variant: "destructive" });
        }
    };
    
    if (loading) {
        return (
             <div className="flex flex-col min-h-screen bg-background justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg">Carregando detalhes do Report #{reportId}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                    <Alert variant="destructive">
                        <AlertTitle>Erro de Conexão</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button onClick={() => router.push('/dashboard/admin/reports')} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }
    
    if (!report || !currentStatus) return null; 

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FileText className="mr-3 h-7 w-7 text-primary" />
                        Detalhes do Report #{report.id}
                    </h1>
                    <Button variant="outline" onClick={() => router.push('/dashboard/admin/reports')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUNA PRINCIPAL: Detalhes e Ações (70%) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Detalhes do Incidente */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ClipboardList className="mr-2 h-5 w-5" />
                                    {report.title}
                                </CardTitle>
                                <CardDescription>
                                    Relato detalhado da ocorrência.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                
                                {/* Reportado Por: */}
                                <Alert className="bg-muted">
                                    <User className="h-4 w-4" />
                                    <AlertTitle>Reportado Por:</AlertTitle>
                                    <AlertDescription className="font-medium">
                                        {report.reportedBy} ({report.reporterId ? `ID: ${report.reporterId}` : 'ID não informado'})
                                        <span className="text-sm text-muted-foreground ml-2">em {new Date(report.date).toLocaleDateString()}</span>
                                    </AlertDescription>
                                </Alert>
                                
                                <p className="text-sm font-semibold">Descrição Completa:</p>
                                <p className="whitespace-pre-wrap text-muted-foreground">{report.fullDescription}</p>

                                {report.busId && (
                                    <p className="text-sm font-semibold">Veículo Afetado: <span className="font-normal text-muted-foreground">{report.busId}</span></p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2. Ação e Resolução */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Save className="mr-2 h-5 w-5" />
                                    Ações Administrativas
                                </CardTitle>
                                <CardDescription>
                                    Atualize o status e adicione notas de resolução.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                
                                {/* Status e Categoria */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status-select">Status do Report</Label>
                                        <Select 
                                            value={currentStatus} 
                                            onValueChange={(value: ReportStatus) => setCurrentStatus(value)}
                                        >
                                            <SelectTrigger id="status-select">
                                                <SelectValue placeholder="Mudar Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(STATUS_DISPLAY_MAP).map(statusKey => (
                                                    <SelectItem key={statusKey} value={statusKey}>
                                                        {STATUS_DISPLAY_MAP[statusKey as ReportStatus]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>Categoria (Não Editável)</Label>
                                        <Input disabled value={formatCategoryText(report.category)} />
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                {/* Notas de Resolução */}
                                <div className="space-y-2">
                                    <Label htmlFor="resolution-note" className="flex items-center">
                                        <MessageSquare className="mr-1 h-4 w-4" />
                                        Adicionar Nota Interna
                                    </Label>
                                    <Textarea 
                                        id="resolution-note"
                                        placeholder="Descreva as ações tomadas, como investigação, contato com a transportadora, etc. (Visível apenas para admins)."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                                
                                <Button 
                                    className="w-full" 
                                    onClick={handleUpdateReport}
                                    disabled={currentStatus === report.status && !newNote.trim()}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Alterações
                                </Button>
                                
                            </CardContent>
                        </Card>
                    </div>

                    {/* COLUNA LATERAL: Status Rápido e Histórico (30%) */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Painel Rápido */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Triagem Rápida</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium flex items-center"><Clock className="mr-2 h-4 w-4" />Status Atual:</span>
                                    <Badge className={getStatusColor(report.status)}>{STATUS_DISPLAY_MAP[report.status]}</Badge>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4" />Criado em:</span>
                                    <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium flex items-center"><User className="mr-2 h-4 w-4" />ID do Reportador:</span>
                                    <span>#{report.reporterId}</span>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Histórico/Notas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <History className="mr-2 h-5 w-5" />
                                    Histórico e Notas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                                
                                {/* Histórico de Ações */}
                                {report.history.map((item) => (
                                    <div key={item.timestamp + item.action} className="border-l-4 border-primary/50 pl-3">
                                        <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                                        <p className="font-medium text-sm">{item.action}</p>
                                        <p className="text-xs italic">por {item.user}</p>
                                    </div>
                                ))}
                                
                                <Separator />

                                {/* Notas de Resolução Salvas */}
                                <h4 className="font-semibold text-sm pt-2">Notas de Resolução Salvas:</h4>
                                {report.resolutionNotes.map((note) => (
                                    <div key={note.timestamp + note.adminName} className="bg-secondary/50 p-3 rounded text-sm">
                                        <p className="text-xs text-primary font-medium">{note.adminName} ({new Date(note.timestamp).toLocaleDateString()})</p>
                                        <p className="mt-1 whitespace-pre-wrap">{note.note}</p>
                                    </div>
                                ))}

                            </CardContent>
                        </Card>
                        
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
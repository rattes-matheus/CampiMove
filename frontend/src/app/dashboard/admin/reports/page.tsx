'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Clock, CheckCircle, Search, FileText, X, Loader2 } from 'lucide-react';
import { getFilteredReports } from '@/services/reportService';
import { 
    ReportResponse, 
    ReportFilterParams, 
    ReportStatus, 
    ReportCategory, 
    PageData 
} from '@/types/reports'; 

const INITIAL_PAGE_DATA: PageData<ReportResponse> = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10, 
    first: true,
    last: true,
    empty: true,
    numberOfElements: 0,
};

const INITIAL_PARAMS: ReportFilterParams = {
    page: 0, 
    pageSize: 10,
    searchTerm: '',
    status: undefined, 
    category: undefined,
};

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

export default function AdminReportsPage() {
    const router = useRouter();
    
    
    const [params, setParams] = useState<ReportFilterParams>(INITIAL_PARAMS);
    const [data, setData] = useState<PageData<ReportResponse>>(INITIAL_PAGE_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getFilteredReports(params); 
            setData(result);
        } catch (e) {
            console.error("Falha ao buscar reports:", e);
            setError("Não foi possível carregar os reports. Verifique se o servidor Spring Boot está ativo (porta 8080).");
            setData(INITIAL_PAGE_DATA);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleViewDetails = (id: number) => {
        router.push(`/dashboard/admin/reports/${id}`);
    };
    const handleStatusFilterChange = (value: string) => {
        const newStatus = value === 'TODOS' ? undefined : (value as ReportStatus);
        setParams(prev => ({ ...prev, status: newStatus, page: 0 })); 
    };

    const handleCategoryFilterChange = (value: string) => {
        const newCategory = value === 'TODAS' ? undefined : (value as ReportCategory);
        setParams(prev => ({ ...prev, category: newCategory, page: 0 }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setParams(prev => ({ ...prev, searchTerm: newSearchTerm, page: 0 }));
    };

    const handleClearSearch = () => {
        setParams(prev => ({ ...prev, searchTerm: '', page: 0 }));
    }

    const currentStatusFilter = params.status || 'TODOS';
    const currentCategoryFilter = params.category || 'TODAS';

    

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-4 flex items-center">
                    <FileText className="mr-3 h-7 w-7 text-primary" />
                    Central de Reports de Usuários
                </h1>
                <p className="text-muted-foreground mb-8">
                    Visualize, filtre e gerencie o fluxo de trabalho dos reports enviados.
                </p>
                
                {/* SEÇÃO DE FILTROS */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    
                    {/* Filtro de Busca (ID, Título ou Usuário) */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por ID, Título ou Usuário..." 
                            value={params.searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-10"
                        />
                        {params.searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearSearch}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filtro de Status */}
                    <Select 
                        value={currentStatusFilter} 
                        onValueChange={handleStatusFilterChange}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar por Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos os Status</SelectItem>
                            {Object.keys(STATUS_DISPLAY_MAP).map(statusKey => (
                                <SelectItem key={statusKey} value={statusKey}>
                                    {STATUS_DISPLAY_MAP[statusKey as ReportStatus]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filtro de Categoria */}
                    <Select 
                        value={currentCategoryFilter} 
                        onValueChange={handleCategoryFilterChange}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar por Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODAS">Todas as Categorias</SelectItem>
                            {Object.keys({
                                'ATRASO_SIGNIFICATIVO': 'Atraso Significativo (15+ min)',
                                'NAO_APARECEU': 'Ônibus Não Apareceu',
                                'SUPERLOTACAO': 'Superlotação',
                                'PROBLEMA_MOTORISTA': 'Problema com Motorista',
                                'SEGURANCA': 'Segurança',
                                'PROBLEMA_ROTA': 'Problema na Rota',
                                'CONFORTO_LIMPEZA': 'Conforto/Limpeza',
                                'OUTRO_PROBLEMA': 'Outro Problema',
                            } as Record<ReportCategory, string>).map(categoryKey => (
                                <SelectItem key={categoryKey} value={categoryKey}>
                                    {formatCategoryText(categoryKey as ReportCategory)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* FIM SEÇÃO DE FILTROS */}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Search className="mr-2 h-5 w-5" />
                            Lista de Ocorrências ({data.totalElements} encontradas)
                        </CardTitle>
                        <CardDescription>
                            Reports em ordem cronológica de abertura. 
                            {data.content.length > 0 && 
                                `Exibindo página ${data.number + 1} de ${data.totalPages}.`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="mr-2 h-8 w-8 animate-spin" /> 
                                <span className="text-lg">Carregando dados do Backend...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded">
                                Erro de Conexão: {error}
                            </div>
                        ) : data.content.length === 0 ? (
                            <p className="p-4 text-center text-muted-foreground">
                                Nenhum report encontrado com os filtros atuais.
                            </p>
                        ) : (
                            <>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Resumo do Report</TableHead>
                                                <TableHead>Categoria</TableHead>
                                                <TableHead className="w-[150px]">Status</TableHead>
                                                <TableHead className="w-[120px]">Data</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.content.map(report => (
                                                <TableRow key={report.id}>
                                                    <TableCell className="font-medium">#{report.id}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{report.title}</TableCell>
                                                    <TableCell className="text-sm">{formatCategoryText(report.category)}</TableCell>
                                                    
                                                    <TableCell>
                                                        <Badge className={getStatusColor(report.status)}>
                                                            {STATUS_DISPLAY_MAP[report.status]}
                                                        </Badge>
                                                    </TableCell>
                                                    
                                                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => handleViewDetails(report.id)}
                                                            className="group"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4 group-hover:text-primary" /> 
                                                            Ver Detalhes
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {/* Implementação SIMPLES de Paginação (Próxima/Anterior) */}
                                <div className="flex justify-between items-center mt-4">
                                    <Button
                                        variant="outline"
                                        disabled={data.first || loading}
                                        onClick={() => setParams(prev => ({ ...prev, page: prev.page - 1 }))}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Página {data.number + 1} de {data.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={data.last || loading}
                                        onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

            </main>
            <Footer />
        </div>
    );
}
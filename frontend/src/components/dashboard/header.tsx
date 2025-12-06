'use client';

import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useRouter, usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export function DashboardHeader() {
    const router = useRouter();
    const [notifications, setNotification] = useState<{ title: string, message: string }[]>([]);
    let token: any = null;

    if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [profilePictureURL, setProfilePictureURL] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("email")
        router.push('/');
    };

    async function fetchData() {
        try {
            const response = await axios.get<{ email: string, name: string }>(`http://localhost:8080/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsername(response.data.name);
            setEmail(response.data.email);
            setProfilePictureURL("http://localhost:8080" + response.data.profilePictureURL);

            const notificationsRes = await axios.get("http://localhost:8080/api/notifications");

            setNotification(notificationsRes.data);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            toast({
                title: 'Erro de Carregamento',
                description: 'Não foi possível carregar os dados do perfil. Verifique a API e o Token.',
                variant: 'destructive'
            });
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <nav className="flex items-center justify-between w-full">
                    <Link href={"/dashboard"} className="mr-6 flex items-center space-x-2">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
                                    <span className="sr-only">Alternar notificações</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80" align="end">
                                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.length > 0 ? (
                                    notifications.map((n, index) => (
                                        <DropdownMenuItem key={index} className="flex flex-col items-start gap-1">
                                            <p className="font-semibold">{n.title}</p>
                                            <p className="text-xs text-muted-foreground">{n.message}</p>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem>Nenhuma nova notificação</DropdownMenuItem>
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        {profilePictureURL && <AvatarImage src={profilePictureURL} />}
                                        <AvatarFallback>{username[0] ? username[0].toUpperCase() : username[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/edit-profile">Editar Perfil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            </div>
        </header>
    );
}

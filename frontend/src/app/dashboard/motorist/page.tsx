'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Bus, CarIcon, Clock, MessageSquare} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import {toast} from "@/hooks/use-toast";
import {useRouter} from 'next/navigation';

const SOCKET_URL = 'http://localhost:8080/ws';

type ConversationMessage = {
    senderId: string;
    senderName: string;
    recipientId: string;
    text: string;
};

type ConversationState = {
    userId: string;
    userName: string;
    lastMessage: string;
    motoristId: string;
};

type NextTravel = {
    motoristName: string;
    origin: string;
    destination: string;
    schedule: string;
};

export default function MotoristDashboardPage() {

    const router = useRouter()

    const [userId, setUserId] = useState<number>();
    const [nextTravels, setNextTravels] = useState<NextTravel[]>([]);

    const [numberOfTravels, setNumberOfTravels] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            let token = null;
            if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');
            if (!token) return router.push("/login");

            const res = await axios.get("http://localhost:8080/auth/me", {
                headers: {Authorization: `Bearer ${token}`}
            })
            const userRole = res.data.role;
            const userId: string = res.data.id;

            if (userRole !== "DRIVER") {
                router.push("/dashboard");
                return;
            }

            const travelsRes = await axios.get<NextTravel[]>("http://localhost:8080/travels/my-upcoming-motorist", {
                headers: {Authorization: `Bearer ${token}`},
                params: {
                    id: userId
                }
            });

            setNumberOfTravels(travelsRes.data.length);

            setNextTravels(travelsRes.data);
        }
        fetchData();
    }, [router]);

    let token: any = null;

    if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

    async function fetchUserData() {
        try {
            const response = await axios.get<{email: string, name: string, id: number}>(`http://localhost:8080/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserId(response.data.id)

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            toast({
                title: 'Erro de Carregamento',
                description: 'Não foi possível carregar os dados do perfil. Verifique a API e o Token.',
                variant: 'destructive'
            });
        }
    }

    async function fetchConversations(motoristId: number) {
        try {
            const response = await axios.get<ConversationState[]>(
                `http://localhost:8080/chat/conversations/${motoristId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveConversations(response.data);
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
            toast({
                title: 'Erro de Carregamento',
                description: 'Não foi possível carregar as conversas. Verifique a API e o Token.',
                variant: 'destructive'
            });
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchUserData();
        }
        loadData();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchConversations(userId);
        }
    }, [userId]);

    const [activeConversations, setActiveConversations] = useState<ConversationState[]>([]);

    useEffect(() => {

        if (!userId) {
            console.log("Dashboard: Aguardando userId...");
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            reconnectDelay: 5000,
            onConnect: (frame) => {
                client.subscribe(`/topic/dashboard/${userId}`, (message) => {
                    const receivedMsg: ConversationMessage = JSON.parse(message.body);

                    setActiveConversations(prevConversations => {
                        const existingChatIndex = prevConversations.findIndex(
                            chat => chat.userId === receivedMsg.senderId || chat.userId === receivedMsg.recipientId
                        );

                        const newChat: ConversationState = {
                            userId: receivedMsg.senderId,
                            userName: receivedMsg.senderName,
                            lastMessage: receivedMsg.text,
                            motoristId: receivedMsg.recipientId,
                        };

                        if (existingChatIndex !== -1) {
                            const updatedChats = prevConversations.filter((_, index) => index !== existingChatIndex);
                            return [newChat, ...updatedChats];
                        } else {
                            return [newChat, ...prevConversations];
                        }
                    });
                });
            },
            onStompError: (frame) => {
                console.error('Erro no Broker (Dashboard): ' + frame.headers['message']);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [userId]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Bem-vindo, Motorista</h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Rotas Ativas</CardTitle>
                            <Bus className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{numberOfTravels}</div>
                            <p className="text-xs text-muted-foreground">Você tem {numberOfTravels} rotas ativas hoje</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Próximas Viagens</CardTitle>
                            <CardDescription>Viagens que você agendou.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {nextTravels.length > 0 ? nextTravels.map((travel, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                    <div>
                                        <p className="font-semibold">Para {travel.destination}</p>
                                        <p className="text-sm text-muted-foreground">com {travel.motoristName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        {travel.schedule}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted-foreground p-4">Nenhuma viagem agendada.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Cadastrar um Novo Transporte</CardTitle>
                            <CarIcon className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Adicione um novo veículo à sua frota para começar a oferecer caronas.</p>
                            <Button className="w-full" asChild>
                                <Link href="/register-transport">
                                    Cadastrar Transporte
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Conversas Ativas</CardTitle>
                            <CardDescription>Visualize e responda às mensagens dos passageiros.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeConversations.map((chat) => (
                                <Link key={chat.userId} href={`/chat/${chat.motoristId}?with=${chat.userId}`} className="block">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                                        <div>
                                            <p className="font-semibold">{chat.userName}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-xs">{chat.lastMessage}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Abrir Chat
                                        </Button>
                                    </div>
                                </Link>
                            ))}
                            {activeConversations.length === 0 && (
                                <p className="text-center text-muted-foreground p-4">Nenhuma conversa ativa no momento.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
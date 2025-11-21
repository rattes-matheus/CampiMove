'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, CarIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import {toast} from "@/hooks/use-toast";

const SOCKET_URL = 'http://localhost:8080/ws';

type ConversationMessage = {
    senderId: string;
    senderName: string;
    recipientId: string; // Este será o FAKE_MOTORIST_ID
    text: string;
};

type ConversationState = {
    userId: string;
    userName: string;
    lastMessage: string;
    motoristId: string;
};

export default function MotoristDashboardPage() {

    const [userId, setUserId] = useState<number>();

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

    useEffect(() => {
        fetchUserData();
    }, []);

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
                console.log('Dashboard Conectado: ' + frame);

                client.subscribe(`/topic/dashboard/${userId}`, (message) => {
                    const receivedMsg: ConversationMessage = JSON.parse(message.body);

                    setActiveConversations(prevConversations => {
                        const existingChatIndex = prevConversations.findIndex(
                            (chat) => chat.userId === receivedMsg.senderId
                        );

                        const newConversationEntry: ConversationState = {
                            userId: receivedMsg.senderId,
                            userName: receivedMsg.senderName,
                            lastMessage: receivedMsg.text,
                            motoristId: receivedMsg.recipientId, // que é o ID deste motorista
                        };

                        if (existingChatIndex > -1) {
                            const updatedConversations = [...prevConversations];
                            updatedConversations[existingChatIndex] = newConversationEntry;
                            return updatedConversations;
                        } else {
                            return [newConversationEntry, ...prevConversations];
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
                            <div className="text-4xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">Você tem 2 rotas ativas hoje</p>
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
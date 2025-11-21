'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Driver } from '@/lib/DriverData';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {toast} from "@/hooks/use-toast";

type RecipientUser = {
    id: number;
    name: string;
    profilePictureURL?: string;
};

type Message = {
    senderId: string;
    senderName: string;
    recipientId: string;
    text: string;
    timestamp: string;
};

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const motoristId = params.motoristId as string;
    const withUserId = searchParams.get('with');

    const [motorist, setMotorist] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [recipientUser, setRecipientUser] = useState<RecipientUser | null>(null);
    const [isRecipientLoading, setIsRecipientLoading] = useState(true);

    const [userId, setUserId] = useState<number>()
    const [username, setUsername] = useState<string>()

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
            setUsername(response.data.name)

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            toast({
                title: 'Erro de Carregamento',
                description: 'Não foi possível carregar os dados do perfil. Verifique a API e o Token.',
                variant: 'destructive'
            });
        }
    }

    const SOCKET_URL = 'http://localhost:8080/ws';

    useEffect(() => {
        if (withUserId) {
            setIsRecipientLoading(true);
            async function fetchRecipientUser() {
                try {
                    // Você precisa ter este endpoint no seu backend
                    const response = await axios.get<RecipientUser>(`http://localhost:8080/auth/user/${withUserId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRecipientUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch recipient user data:", error);
                    setRecipientUser(null);
                } finally {
                    setIsRecipientLoading(false);
                }
            }
            fetchRecipientUser();
        } else {
            setIsRecipientLoading(false);
        }
    }, [withUserId, token]);

    useEffect(() => {
        async function fetchMotorist() {
            try {
                const response = await axios.get(`http://localhost:8080/drivers`);
                const motoristResponse = response.data.find((data: Driver) => data.id === parseInt(motoristId))
                setMotorist(motoristResponse);
            } catch (error) {
                console.error("Failed to fetch motorist data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMotorist();
        fetchUserData()
    }, [motoristId]);

    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const recipient = withUserId ? recipientUser : motorist;
    const recipientName = withUserId ? recipientUser?.name : motorist?.motorist;
    const recipientAvatarUrl = withUserId
        ? (recipientUser?.profilePictureURL ? `http://localhost:8080${recipientUser.profilePictureURL}` : undefined)
        : (motorist?.profilePictureURL ? `http://localhost:8080${motorist.profilePictureURL}` : undefined);

    useEffect(() => {
        if (!userId) {
            console.log("ChatPage: Aguardando userId para criar sala...");
            return;
        }


        const currentUserId = withUserId ? motoristId : userId.toString();
        const recipientId = withUserId ? withUserId : motoristId;

        const sortedIds = [currentUserId, recipientId].sort();
        setRoomId(sortedIds.join('_'));

    }, [motoristId, withUserId, userId]);


    useEffect(() => {
        if (!roomId) return;

        console.log(`Tentando conectar à sala: ${roomId}`);

        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('Conectado: ' + frame);

                client.subscribe(`/topic/chat/${roomId}`, (message) => {
                    const receivedMessage: Message = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('Erro no Broker: ' + frame.headers['message']);
                console.error('Detalhes: ' + frame.body);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            console.log("Desconectado.");
        };
    }, [roomId]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (newMessage.trim() && stompClient && roomId && userId && username) {

            const recipientId = withUserId ? withUserId : motoristId;
            const currentUserId = withUserId ? motoristId : userId.toString();

            const message: Message = {
                senderId: currentUserId,
                senderName: username,
                recipientId: recipientId,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            const finalMessage: Message = {
                senderId: userId.toString(),
                senderName: username,
                recipientId: withUserId ? withUserId : motoristId,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };


            stompClient.publish({
                destination: `/app/chat.sendMessage/${roomId}`,
                body: JSON.stringify(finalMessage)
            });

            setNewMessage('');
        }
    };

    if (isLoading || isRecipientLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <p>Carregando...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!motorist || (withUserId && !recipient)) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center p-8">
                        <CardTitle>Participante não encontrado</CardTitle>
                        <CardContent>
                            <p className="text-muted-foreground mt-4">A pessoa com quem você está tentando conversar não foi encontrada.</p>
                            <Button onClick={() => router.back()} className="mt-6">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    if (!recipient) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader />
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center p-8">
                        <CardTitle>Participante não encontrado</CardTitle>
                        <CardContent>
                            <p className="text-muted-foreground mt-4">A pessoa com quem você está tentando conversar não foi encontrada.</p>
                            <Button onClick={() => router.back()} className="mt-6">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    const getFallbackName = (name: string | undefined) => {
        return name ? name.split(" ").map(n => n[0]).join("") : "U";
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="flex flex-col h-[70vh]">
                        <CardHeader className="flex flex-row items-center gap-4 border-b">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft />
                            </Button>
                            {recipientAvatarUrl && (
                                <Avatar>
                                    <AvatarImage src={recipientAvatarUrl} alt={recipientName} />
                                    <AvatarFallback>{getFallbackName(recipientName)}</AvatarFallback>
                                </Avatar>
                            )}
                            <CardTitle className="text-lg">{recipientName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, index) => {
                                const isCurrentUser = msg.senderId === userId?.toString();

                                const messageSenderName = isCurrentUser ? "" : recipientName;
                                const senderAvatarUrl = isCurrentUser ? undefined : recipientAvatarUrl;


                                return (
                                    <div
                                        key={index}
                                        className={`flex items-end gap-2 ${
                                            isCurrentUser ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {!isCurrentUser && senderAvatarUrl && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={senderAvatarUrl} />
                                                <AvatarFallback>{getFallbackName(messageSenderName)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                                                isCurrentUser
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className="text-xs opacity-75 mt-1 text-right">{msg.timestamp}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-grow"
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

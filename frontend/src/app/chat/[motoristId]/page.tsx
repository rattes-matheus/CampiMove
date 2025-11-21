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


type Message = {
    sender: 'user' | 'motorist';
    text: string;
    timestamp: string;
};

// Sample user data, as we don't have a user service yet.
const users: { [key: string]: { id: string, name: string, profilePictureURL: string } } = {
    'user-123': { id: 'user-123', name: 'Ana Clara', profilePictureURL: "https://picsum.photos/seed/101/100/100" },
    'user-456': { id: 'user-456', name: 'Bruno Lima', profilePictureURL: "https://picsum.photos/seed/102/100/100" },
};


export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const motoristId = params.motoristId as string;
    const withUserId = searchParams.get('with');

    const [motorist, setMotorist] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
    }, []);

    // Determine who the other person in the chat is.
    const recipient = withUserId ? users[withUserId] : motorist;
    const recipientName = withUserId ? recipient?.name : motorist?.motorist;
    const recipientAvatarUrl = withUserId ? recipient?.profilePictureURL : (motorist ? `http://localhost:8080${motorist.profilePictureURL}` : undefined);

    // Since we don't have auth, we assume the current user is 'user' if chatting with a motorist,
    // and 'motorist' if chatting with a user.
    const currentUserRole = withUserId ? 'motorist' : 'user';

    const initialMessages = withUserId ? conversations[withUserId] : [];

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: Message = {
                sender: currentUserRole,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    if (isLoading) {
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
                                const isCurrentUser = msg.sender === currentUserRole;
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

'use client';

import {useState, useEffect} from 'react';
import {DashboardHeader} from '@/components/dashboard/header';
import {Footer} from '@/components/landing/footer';
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {ArrowLeft, CalendarPlus, Check, Send} from 'lucide-react';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {Driver} from '@/lib/DriverData';
import axios from 'axios';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {toast} from "@/hooks/use-toast";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "recharts";

type RecipientUser = {
    id: number;
    name: string;
    profilePictureURL?: string;
};

type Message = {
    senderId: string;
    senderName: string;
    recipientId: string;
    text?: string;
    timestamp: string;
    isTripAccepted?: boolean;
    tripProposal?: TripDetails;
};

type TripDetails = {
    origin: string;
    destination: string;
    price: string;
    schedule: string;
    motoristPhone: string | undefined;
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
    const [userRole, setUserRole] = useState<string>()

    const [recipientAvatarUrl, setRecipientAvatarUrl] = useState<string>("nothing")

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [price, setPrice] = useState('');
    const [schedule, setSchedule] = useState('');
    const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);

    const [acceptedTravels, setAcceptedTravels] = useState(0);

    let token: any = null;

    if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

    async function fetchUserData() {
        try {
            const response = await axios.get<{
                email: string,
                name: string,
                id: number,
                role: string
            }>(`http://localhost:8080/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserId(response.data.id)
            setUsername(response.data.name)
            setUserRole(response.data.role)

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
        setIsRecipientLoading(true);

        async function fetchRecipientUser() {
            try {
                const response = await axios.get<RecipientUser>(`http://localhost:8080/auth/user/${withUserId || motoristId}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data)
                setRecipientUser(response.data);
            } catch (error) {
                console.error("Failed to fetch recipient user data:", error);
                setRecipientUser(null);
            } finally {
                setIsRecipientLoading(false);
            }
        }

        fetchRecipientUser();
    }, [withUserId, token, acceptedTravels]);

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

        fetchUserData()
        fetchMotorist();
    }, [motoristId, acceptedTravels]);

    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const recipient = withUserId ? recipientUser : motorist;
    const recipientName = withUserId ? recipientUser?.name : motorist?.motorist;

    useEffect(() => {
        if (!userId) {
            console.log("ChatPage: Aguardando userId para criar sala...");
            return;
        }

        const currentUserId = withUserId ? motoristId : userId.toString();
        const recipientId = withUserId ? withUserId : motoristId;

        const sortedIds = [currentUserId, recipientId].sort();
        setRoomId(sortedIds.join('_'));

    }, [motoristId, withUserId, userId, acceptedTravels]);


    useEffect(() => {
        if (!roomId) return;

        let client: Client;

        const fetchHistoryAndConnect = async () => {
            try {
                const response = await axios.get<Message[]>(
                    `http://localhost:8080/chat/history/${roomId}`,
                    {
                        headers: {Authorization: `Bearer ${token}`}
                    }
                );
                setMessages(response.data);

            } catch (err) {
                console.error("Falha ao buscar histórico:", err);
                toast({
                    title: 'Erro ao carregar chat',
                    description: 'Não foi possível carregar o histórico de mensagens.',
                    variant: 'destructive'
                });
            }

            console.log(`Tentando conectar à sala: ${roomId} (após carregar histórico)`);

            client = new Client({
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
                },
            });

            client.activate();
            setStompClient(client);
        };

        fetchHistoryAndConnect();

        return () => {
            if (client) {
                client.deactivate();
                console.log("Desconectado.");
            }
        };
    }, [roomId, token, acceptedTravels]);

    useEffect(() => {
        setRecipientAvatarUrl(`http://localhost:8080${recipientUser?.profilePictureURL}`)
    }, [recipientUser, userRole])


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (newMessage.trim() && stompClient && roomId && userId && username) {
            const finalMessage: Message = {
                senderId: userId.toString(),
                senderName: username,
                recipientId: withUserId ? withUserId : motoristId,
                text: newMessage,
                timestamp: new Date().toISOString(),
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
                <DashboardHeader/>
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <p>Carregando...</p>
                </main>
                <Footer/>
            </div>
        );
    }

    if (!motorist || (withUserId && !recipient)) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader/>
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center p-8">
                        <CardTitle>Participante não encontrado</CardTitle>
                        <CardContent>
                            <p className="text-muted-foreground mt-4">A pessoa com quem você está tentando conversar não
                                foi encontrada.</p>
                            <Button onClick={() => router.back()} className="mt-6">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Voltar
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer/>
            </div>
        );
    }

    if (!recipient) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <DashboardHeader/>
                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center p-8">
                        <CardTitle>Participante não encontrado</CardTitle>
                        <CardContent>
                            <p className="text-muted-foreground mt-4">A pessoa com quem você está tentando conversar não
                                foi encontrada.</p>
                            <Button onClick={() => router.back()} className="mt-6">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Voltar
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer/>
            </div>
        );
    }

    const handleSendProposal = () => {
        if (origin && destination && price && schedule) {
            const proposal: TripDetails = {origin, destination, price, schedule, motoristPhone: motorist?.phoneNumber};

            if (userId && username) {
                const message: Message = {
                    senderId: userId.toString(),
                    senderName: username,
                    recipientId: withUserId ? withUserId : motoristId,
                    timestamp: new Date().toISOString(),
                    tripProposal: proposal,
                };
                if (stompClient && stompClient.connected) {
                    stompClient.publish({
                        destination: `/app/chat.sendMessage/${roomId}`,
                        body: JSON.stringify(message)
                    });
                }

                setIsProposalDialogOpen(false);
                setOrigin('');
                setDestination('');
                setPrice('');
                setSchedule('');
            }
        } else {
            toast({
                title: "Erro",
                description: "Por favor, preencha todos os campos da proposta.",
                variant: "destructive"
            });
        }
    };

    const handleAcceptTravel = (proposal: TripDetails) => {
        const acceptedTravel = {
            ...proposal,
            motoristName: motorist?.motorist,
            passengerName: recipientName,
            status: 'Agendada'
        };

        const existingTravels = JSON.parse(localStorage.getItem('acceptedTravels') || '[]');
        localStorage.setItem('acceptedTravels', JSON.stringify([...existingTravels, acceptedTravel]));

        if (recipientUser && userId && username) {
            const acceptedMessage: Message = {
                senderId: userId.toString(),
                senderName: username,
                recipientId: withUserId ? withUserId : motoristId,
                timestamp: new Date().toISOString(),
                text: 'Viagem aceita!',
            };

            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: `/app/chat.sendMessage/${roomId}`,
                    body: JSON.stringify(acceptedMessage)
                });
            }

            axios.put("http://localhost:8080/travels/status", {
                id: roomId,
                status: true
            }, {
                headers: {Authorization: `Bearer ${token}`}
            })

            toast({title: "Viagem Aceita!", description: "A viagem foi adicionada ao seu painel."});

            setAcceptedTravels(acceptedTravels+1);
        }
    };

    const getFallbackName = (name: string | undefined) => {
        return name ? name.split(" ").map(n => n[0]).join("") : "U";
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader/>
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="flex flex-col h-[70vh]">
                        <CardHeader className="flex flex-row items-center gap-4 border-b">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft/>
                            </Button>
                            {recipientAvatarUrl && (
                                <Avatar>
                                    <AvatarImage src={recipientAvatarUrl} alt={recipientName}/>
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

                                if (msg.tripProposal) {
                                    return (
                                        <div key={index} className="flex justify-center">
                                            <Card className="w-full max-w-sm my-2">
                                                <CardHeader>
                                                    <CardTitle className="text-center">Proposta de Viagem</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-sm space-y-2">
                                                    <p><strong>De:</strong> {msg.tripProposal.origin}</p>
                                                    <p><strong>Para:</strong> {msg.tripProposal.destination}</p>
                                                    <p><strong>Horário:</strong> {msg.tripProposal.schedule}</p>
                                                    <p><strong>Preço:</strong> R$ {msg.tripProposal.price}</p>
                                                    <p><strong>Contato do
                                                        Motorista:</strong> {msg.tripProposal.motoristPhone}</p>
                                                </CardContent>
                                                {(userRole === 'STUDENT' || userRole === "TEACHER") && (
                                                    <CardFooter>
                                                        <Button className="w-full"
                                                                disabled={msg.isTripAccepted}
                                                                onClick={() => handleAcceptTravel(msg.tripProposal!)}>
                                                            <Check className="mr-2 h-4 w-4"/> Aceitar Viagem
                                                        </Button>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-end gap-2 ${
                                            isCurrentUser ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {!isCurrentUser && senderAvatarUrl && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={senderAvatarUrl}/>
                                                <AvatarFallback>{getFallbackName(messageSenderName)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                                                msg.isTripAccepted
                                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                                    : isCurrentUser
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className="text-xs opacity-75 mt-1 text-right">{new Date(msg.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">

                                {userRole === 'DRIVER' && (
                                    <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" size="icon">
                                                <CalendarPlus className="h-4 w-4"/>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Propor Nova Viagem</DialogTitle>
                                                <DialogDescription>Preencha os detalhes da viagem para enviar ao
                                                    passageiro.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="origin">Origem</Label>
                                                    <Input id="origin" value={origin}
                                                           onChange={(e) => setOrigin(e.target.value)}
                                                           placeholder="Ex: Campus I"/>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="destination">Destino</Label>
                                                    <Input id="destination" value={destination}
                                                           onChange={(e) => setDestination(e.target.value)}
                                                           placeholder="Ex: Campus II"/>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="price">Preço (R$)</Label>
                                                    <Input id="price" type="number" value={price}
                                                           onChange={(e) => setPrice(e.target.value)}
                                                           placeholder="Ex: 10,00"/>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="schedule">Horário</Label>
                                                    <Input id="schedule" type="time" value={schedule}
                                                           onChange={(e) => setSchedule(e.target.value)}/>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancelar</Button>
                                                </DialogClose>
                                                <Button onClick={handleSendProposal}>Enviar Proposta</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}

                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-grow"
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4"/>
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

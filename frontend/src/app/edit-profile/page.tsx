'use client';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {useState, useEffect, useCallback} from 'react';
import {Camera, Save} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const CURRENT_USER_ID = 1;

type User = {
    id: number;
    name: string;
    email: string;
    profilePictureUrl: string | null;
};

export default function EditProfilePage() {
    const {toast} = useToast();
    const [id, setId] = useState<number>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    let token: any = null;

    if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

    const baseUrlForDisplay = API_URL.includes('backend') ? 'http://localhost:8080' : API_URL;
    const fallbackImage = "";

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<User>(`http://localhost:8080/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setName(response.data.name);
            setEmail(response.data.email);
            setId(response.data.id);

            if (response.data.profilePictureUrl) {
                setCurrentImageUrl(baseUrlForDisplay + response.data.profilePictureUrl);
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            toast({
                title: 'Erro de Carregamento',
                description: 'Não foi possível carregar os dados do perfil. Verifique a API e o Token.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [baseUrlForDisplay, toast]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const profileData = {name, email};

        try {
            const response = await axios.put(
                `http://localhost:8080/profile/${id}`,
                profileData,
                {headers: {Authorization: `Bearer ${token}`}}
            );


            setName(response.data.name);
            setEmail(response.data.email);

            toast({
                title: 'Perfil Atualizado',
                description: 'Suas alterações (nome/email) foram salvas com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast({
                title: 'Erro ao Salvar',
                description: 'Falha ao salvar. (401/403: Token? | 500: Erro do servidor?) Verifique o log do backend.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        e.target.value = '';

        if (!file) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append('profileImage', file);

        try {

            const response = await axios.put(
                `${API_URL}/api/profile/${CURRENT_USER_ID}/picture`,
            );

            if (response.data.profilePictureUrl) {

                const newUrl = baseUrlForDisplay + response.data.profilePictureUrl + `?t=${Date.now()}`;
                setCurrentImageUrl(newUrl);
            }

            toast({
                title: 'Foto Atualizada',
                description: 'Sua foto de perfil foi atualizada com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            toast({
                title: 'Erro no Upload',
                description: 'Não foi possível fazer o upload da foto. O token de segurança está correto?',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Editar Perfil</CardTitle>
                            <CardDescription>Atualize as informações da sua conta e foto de perfil.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveChanges}>
                                <div className="grid gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    src={currentImageUrl || fallbackImage}
                                                    alt="Foto de Perfil"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (target.src !== fallbackImage) {
                                                            target.src = fallbackImage;
                                                        }
                                                    }}
                                                />
                                                <AvatarFallback>
                                                    {name ? name[0].toUpperCase() : 'U'}
                                                </AvatarFallback>
                                            </Avatar>


                                            <label
                                                htmlFor="avatar-upload"
                                                className="absolute bottom-0 right-0 cursor-pointer rounded-full h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                                title="Alterar foto de perfil"
                                            >
                                                <Camera className="h-4 w-4"/>
                                                <span className="sr-only">Alterar avatar</span>
                                            </label>
                                            <Input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <h3 className="text-lg font-semibold">{name || "Carregando..."}</h3>
                                            <p className="text-sm text-muted-foreground">{email || "Carregando..."}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>Salvando...</>
                                            ) : (
                                                <><Save className="mr-2 h-4 w-4"/> Salvar Alterações</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
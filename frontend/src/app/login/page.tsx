
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const response = await axios.post("http://localhost:8080/login", {
            "email" : email,
            "password" : password
            })
         if (response.status === 200) {
                    setError('');
                    const data = response.data;

                    if (typeof window !== 'undefined') localStorage.setItem('jwt_token', data.token);

                    if (data.role == "ADMIN") return router.push("/dashboard/admin")
                    if (data.role == "DRIVER") return router.push("/dashboard/motorist")
                    return router.replace('/dashboard');
                    }

    }catch(err) {
            if (axios.isAxiosError(err) && err.response && err.response.data) {
                const errorMessage = err.response.data.error || 'Erro no login. Tente novamente';
                setError(errorMessage);
                }
            else setError('Ocorreu um erro desconhecido.');
  };
}

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Insira suas credenciais para acessar sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{' '}
                <Link href="/register" className="underline">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post("http://localhost:8080/api/forgot-password", {
        email: email
      });

      if (response.status === 200 || response.status === 201) {
        setSent(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        const errorMessage = err.response.data.email || 'Erro ao enviar o email.';
        setError(errorMessage);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Esqueceu a Senha</CardTitle>
            <CardDescription>
              Digite seu email para receber o link de recuperacao.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!sent ? (
              <form onSubmit={handleForgotPassword}>
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

                  {error && (
                    <p className="text-sm font-medium text-destructive">{error}</p>
                  )}

                  <Button type="submit" className="w-full">
                    Enviar link de recuperacao
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                  Lembrou sua senha?{" "}
                  <Link href="/login" className="underline">
                    Entrar
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">
                  Link de recuperacao enviado.
                </p>

                <Link href="/login" className="underline text-sm block">
                  Voltar ao login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

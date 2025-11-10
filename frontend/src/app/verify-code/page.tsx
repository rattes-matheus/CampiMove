
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) setEmail(storedEmail);
      else router.push("/register");
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentativa de verificação com código:', code);

    try {
        const response = await axios.post("http://localhost:8080/verify-code", {
        "email": email,
        "code": code,
        });

    if (response.status === 200) {
        router.push("/login")
    }

    }catch (err) {
        setError("Codigo invalido")}
    };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifique Sua Conta</CardTitle>
            <CardDescription>Digite o código de 6 dígitos enviado para o seu email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="verification-code">Código de Verificação</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Verificar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Não recebeu um código?{' '}
                <Link href="#" className="underline">
                  Reenviar
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

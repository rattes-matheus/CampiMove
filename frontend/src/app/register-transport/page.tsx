
'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function RegisterTransportPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [transportType, setTransportType] = useState('');
  const [model, setModel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const onlyDigits = phoneNumber.replace(/\D/g, '');
    const onlyNumbers = capacity.replace(/\D/g, '');

    if (!transportType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de transporte.",
        variant: "destructive",
      });
      return;
    }

    if (onlyNumbers.length === 0 || isNaN(Number(onlyNumbers))) {
      toast({
        title: "Capacidade inválida",
        description: "A capacidade deve conter apenas números.",
        variant: "destructive",
      });
      return;
    }

    if (onlyDigits.length !== 11) {
      toast({
        title: "Telefone inválido",
        description: "O número deve conter exatamente 11 dígitos (DDD + número).",
        variant: "destructive",
      });
      return;
    }

    const response = axios.post("http://localhost:8080/api/register-transport", {
      type: transportType,
      model: model,
      capacity: capacity,
      contact: phoneNumber
    }).then(() => {
      toast({ title: "Sucesso", description: "Novo transporte cadastrado" });

      console.log("Transport registered: " + response);
      router.push("/dashboard/motorist");

    }).catch((err: any) => {
      toast({ title: 'Erro', description: 'Erro ao cadastrar novo transporte', variant: 'destructive' });
      console.log("Can't create a new transport: ", err.message);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar um Novo Transporte</CardTitle>
              <CardDescription>Adicione os detalhes do seu veículo para começar a oferecer caronas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="transport-type">Tipo de Transporte</Label>
                    <Select value={transportType} onValueChange={setTransportType}>
                      <SelectTrigger id="transport-type">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Carro</SelectItem>
                        <SelectItem value="Bus">Ônibus</SelectItem>
                        <SelectItem value="Bike">Motocicleta</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Modelo do Veículo</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="ex: Toyota Corolla"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacidade do Veículo</Label>
                    <Input
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="ex: 10"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone-number">Telefone de Contato</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="ex: XXXXXXXXXXX"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Cadastrar Transporte</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

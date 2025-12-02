'use client'

import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Testimonials } from '@/components/landing/testimonials';
import { Cta } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import axios from "axios";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
                          let token = null;
                          if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');
                          if (!token) return router.push("/");

                          const res = await axios.get("http://localhost:8080/auth/me", {
                                    headers: {Authorization: `Bearer ${token}`}
                                   })
                               const userRole = res.data.role;

                          if (userRole === "STUDENT" || userRole === "TEACHER") return router.push("/dashboard");
                          if (userRole == "ADMIN") return router.push("/dashboard/admin")
                                      if (userRole == "DRIVER") return router.push("/dashboard/motorist")
                                      return router.replace('/dashboard');
                          }
                      fetchData();
            }, [router]);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

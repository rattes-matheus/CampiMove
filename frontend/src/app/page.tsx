import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Testimonials } from '@/components/landing/testimonials';
import { Cta } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('jwt_token');
            const userRole = localStorage.getItem('user_role');

            if (!token) return router.push("/");
            if (data.role == "ADMIN") return router.push("/dashboard/admin")
            if (data.role == "DRIVER") return router.push("/dashboard/motorist")
            return router.replace('/dashboard');
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

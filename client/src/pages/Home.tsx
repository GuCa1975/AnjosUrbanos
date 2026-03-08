import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Scissors, Sparkles, Shield, BarChart3, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const hasAccessQuery = trpc.subscription.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else if (hasAccessQuery.data) {
      setLocation("/dashboard");
    } else {
      setLocation("/subscribe");
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "Simulação de Penteados com IA",
      description: "Mostre aos seus clientes como ficam com diferentes penteados antes de qualquer corte. Tecnologia de ponta ao serviço do seu salão.",
    },
    {
      icon: Shield,
      title: "Acesso Seguro e Exclusivo",
      description: "Cada salão tem o seu acesso privado. Os seus dados e os dos seus clientes estão sempre protegidos.",
    },
    {
      icon: BarChart3,
      title: "Painel de Gestão",
      description: "Gira a sua subscrição, consulte o histórico e controle tudo a partir de um painel intuitivo.",
    },
    {
      icon: Scissors,
      title: "Ferramenta Profissional",
      description: "Desenvolvida especificamente para cabeleireiros profissionais. Simples de usar, poderosa nos resultados.",
    },
  ];

  const testimonials = [
    { name: "Maria Santos", salon: "Salão Elegance, Lisboa", text: "Os meus clientes adoram ver o resultado antes de decidirem. As vendas de serviços premium aumentaram 40%." },
    { name: "João Ferreira", salon: "Hair Studio Porto", text: "Uma ferramenta indispensável. Economizo tempo nas consultas e os clientes saem sempre satisfeitos." },
    { name: "Ana Costa", salon: "Beleza & Arte, Braga", text: "Simples de usar e os resultados são impressionantes. Recomendo a todos os colegas." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg text-foreground">Anjos Urbanos Virtual</span>
          </div>
          <div className="flex items-center gap-3">
            {loading ? null : isAuthenticated ? (
              <Button
                onClick={() => setLocation(hasAccessQuery.data ? "/dashboard" : "/subscribe")}
                size="sm"
              >
                {hasAccessQuery.data ? "Ir para o Dashboard" : "Activar Subscrição"}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Entrar
                </Button>
                <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Começar Agora
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary border-primary/20 bg-primary/5">
              <Sparkles className="h-3 w-3 mr-1" />
              Inteligência Artificial para Cabeleireiros
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transforme o Seu Salão com{" "}
              <span className="text-primary">Simulação de Penteados</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Mostre aos seus clientes o resultado final antes de qualquer corte ou coloração.
              Aumente a confiança, reduza devoluções e eleve a experiência do seu salão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-base px-8 shadow-lg hover:shadow-xl transition-all">
                Experimentar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-base px-8">
                Ver Preços
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Sem compromisso. Cancele quando quiser.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo o que o seu salão precisa
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Uma plataforma completa desenvolvida especialmente para profissionais de cabeleireiro em Portugal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-background">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Preço simples e transparente
            </h2>
            <p className="text-muted-foreground text-lg">Um único plano com tudo incluído. Sem surpresas.</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                    Plano Profissional
                  </Badge>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-foreground font-display">29€</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">por salão · faturação mensal</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Simulação de penteados com IA ilimitada",
                    "Assistente virtual para clientes",
                    "Acesso em todos os dispositivos",
                    "Suporte por email",
                    "Atualizações incluídas",
                    "Cancele quando quiser",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-base" size="lg" onClick={handleGetStarted}>
                  Começar Agora — 29€/mês
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Pagamento seguro via Stripe. Cancele a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que dizem os nossos clientes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-sm bg-background">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.salon}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pronto para transformar o seu salão?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Junte-se a centenas de cabeleireiros que já usam a IA para impressionar os seus clientes.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="text-base px-10 shadow-lg">
              Começar Hoje
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Scissors className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm text-foreground">Anjos Urbanos Virtual</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Anjos Urbanos Virtual. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

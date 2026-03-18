import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Scissors, Sparkles, Shield, BarChart3, CheckCircle, ArrowRight, Star, Gift, Zap, MapPin, Calendar, Clock, Users, GraduationCap, Mail, Phone, User, Tag } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function FormacaoForm() {
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Inscrição Formação IA para Cabeleireiros — 18 Maio 2026');
    const body = encodeURIComponent(
      `Nome: ${formData.nome}\nTelefone: ${formData.telefone}\nEmail: ${formData.email}\n\nMensagem:\n${formData.mensagem || '(sem mensagem adicional)'}`
    );
    window.open(`mailto:caccportugal@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-black text-foreground uppercase tracking-wide text-sm mb-2">Pedido Enviado!</h4>
        <p className="text-sm text-muted-foreground mb-4">O seu cliente de email foi aberto com os dados preenchidos. Envie o email para completar a inscrição.</p>
        <p className="text-xs text-muted-foreground">Será contactado pela Associação de Cabeleireiros de Portugal em breve.</p>
        <button onClick={() => setEnviado(false)} className="mt-4 text-xs text-primary hover:underline">Enviar outro pedido</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <User className="h-3 w-3" /> Nome Completo *
        </Label>
        <Input
          id="nome"
          required
          placeholder="O seu nome"
          value={formData.nome}
          onChange={(e) => setFormData(p => ({ ...p, nome: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="telefone" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" /> Telefóne *
        </Label>
        <Input
          id="telefone"
          required
          type="tel"
          placeholder="+351 9XX XXX XXX"
          value={formData.telefone}
          onChange={(e) => setFormData(p => ({ ...p, telefone: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Mail className="h-3 w-3" /> Email *
        </Label>
        <Input
          id="email"
          required
          type="email"
          placeholder="o.seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mensagem" className="text-xs uppercase tracking-wider text-muted-foreground">
          Mensagem (opcional)
        </Label>
        <Textarea
          id="mensagem"
          placeholder="Dúvidas, tipo de inscrição (sócio/não sócio/feira)..."
          value={formData.mensagem}
          onChange={(e) => setFormData(p => ({ ...p, mensagem: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50 resize-none"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]" size="lg">
        <Mail className="mr-2 h-4 w-4" />
        Enviar Pedido de Inscrição
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        O seu pedido será enviado para{" "}
        <a href="mailto:caccportugal@gmail.com" className="text-primary hover:underline">caccportugal@gmail.com</a>
      </p>
    </form>
  );
}

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const hasAccessQuery = trpc.subscription.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else if (user?.role === 'admin' || hasAccessQuery.data) {
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-widest uppercase text-foreground">Anjos Urbanos</span>
              <span className="block text-xs tracking-widest text-muted-foreground uppercase">Virtual</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading ? null : isAuthenticated ? (
              <Button
                onClick={() => setLocation(hasAccessQuery.data ? "/dashboard" : "/subscribe")}
                size="sm"
              >
                {hasAccessQuery.data ? "Dashboard" : "Activar Subscrição"}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => window.location.href = getLoginUrl()}>
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
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/40 text-primary bg-primary/5 uppercase tracking-widest text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight uppercase">
              More Than<br />
              <span className="text-primary">Hairstyle</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Mostre aos seus clientes o resultado final antes de qualquer corte ou coloração.
              Aumente a confiança e eleve a experiência do seu salão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-base px-8 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all">
                Experimentar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-base px-8 uppercase tracking-wider border-border/50 hover:border-primary/50">
                Ver Preços
              </Button>
            </div>
            {/* Badges de confiança */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <Gift className="h-3.5 w-3.5 text-primary" />
                <span>2 simulações gratuitas</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span>7 dias grátis ao subscrever</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                <span>Sem cartão para experimentar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              Tudo o que o seu salão precisa
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Uma plataforma completa desenvolvida especialmente para profissionais de cabeleireiro em Portugal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2 uppercase tracking-wide text-sm">{feature.title}</h3>
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
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              Preço simples e transparente
            </h2>
            <p className="text-muted-foreground text-base">Um único plano com tudo incluído. Sem surpresas.</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 uppercase tracking-widest text-xs">
                    Plano Profissional
                  </Badge>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-foreground">29€</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">por salão · faturação mensal</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
                    <Gift className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">7 dias grátis</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "7 dias gratuitos para experimentar",
                    "Simulação de penteados com IA ilimitada",
                    "Assistente virtual para clientes",
                    "Acesso em todos os dispositivos",
                    "Suporte por email",
                    "Cancele quando quiser, sem penalizações",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-base font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]" size="lg" onClick={handleGetStarted}>
                  Começar com 7 dias grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  7 dias gratuitos · depois 29€/mês · cancele quando quiser
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Tem dúvidas?{" "}
                  <a href="mailto:geral@anjosurbanosvirtual.com" className="text-primary hover:underline">
                    geral@anjosurbanosvirtual.com
                  </a>
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
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              O que dizem os nossos clientes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50 bg-card hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-sm text-foreground uppercase tracking-wide">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.salon}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ExpoCosmética 2026 */}
      <section id="expocosmetica" className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary bg-primary/5 uppercase tracking-widest text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Evento Presencial
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              Venha Conhecer-nos na <span className="text-primary">ExpoCosmética 2026</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Experimente a app ao vivo, fale com a nossa equipa e descubra como a Inteligência Artificial pode transformar o seu salão. Entrada gratuita no stand.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.08)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-foreground uppercase tracking-wide text-sm">Anjos Urbanos® Estúdio Virtual</p>
                        <p className="text-xs text-muted-foreground">Demonstração ao vivo · Entrada gratuita</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground font-bold">12 e 13 de Abril de 2026</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">Stand da Associação de Cabeleireiros de Portugal</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">Simulação ao vivo com o seu próprio telemóvel</span>
                      </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                      <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Oferta Exclusiva para Visitantes
                      </p>
                      <p className="text-sm text-foreground">
                        Quem se inscrever na formação de IA durante os dias da feira beneficia de <strong className="text-primary">desconto especial</strong> no preço de inscrição.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="flex gap-4">
                      <div className="border border-primary/40 rounded-sm px-6 py-4 bg-primary/5">
                        <p className="text-3xl font-black text-primary">12</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Abril</p>
                      </div>
                      <div className="border border-primary/40 rounded-sm px-6 py-4 bg-primary/5">
                        <p className="text-3xl font-black text-primary">13</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Abril</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Traga o seu telemóvel e experimente a simulação de cabelo com IA em tempo real.
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary/40 text-primary hover:bg-primary/10 uppercase tracking-wider text-xs font-bold"
                      onClick={() => document.getElementById('formacao')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Ver Formação com Desconto de Feira
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formação de IA */}
      <section id="formacao" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary bg-primary/5 uppercase tracking-widest text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              Formação Profissional
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              Inteligência Artificial <span className="text-primary">Para Cabeleireiros</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Uma formação prática e intensiva para aprender a usar as ferramentas de IA mais poderosas no seu trabalho diário.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Info da formação */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-black text-foreground uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Detalhes da Formação
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <span className="text-foreground font-bold">18 de Maio de 2026</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">Das 10h00 às 17h00 (7 horas)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">Porto · Instalações da Associação de Cabeleireiros de Portugal</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground font-bold text-primary">Vagas limitadas — máximo 15 participantes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-black text-foreground uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    O que vai aprender
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Simulação de cortes e cores com Inteligência Artificial",
                      "Como criar Reels profissionais para o seu salão",
                      "Optimização de imagens de baixa resolução para redes sociais",
                      "Ferramentas de IA para marketing e captação de clientes",
                      "Automatização de tarefas repetitivas no salão",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-primary/40 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-black text-foreground uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Preços de Inscrição
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-foreground">Sócios da Associação</p>
                        <p className="text-xs text-muted-foreground">Preço normal</p>
                      </div>
                      <span className="text-xl font-black text-foreground">100€</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-foreground">Não Sócios</p>
                        <p className="text-xs text-muted-foreground">Preço normal</p>
                      </div>
                      <span className="text-xl font-black text-foreground">150€</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-sm border border-primary/30">
                      <div>
                        <p className="text-sm font-bold text-primary">Inscrição na Feira</p>
                        <p className="text-xs text-primary/70">Desconto exclusivo ExpoCosmética</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-primary">100€</span>
                        <p className="text-xs text-primary/70">sócios e não sócios</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    * Desconto de feira válido apenas para inscrições realizadas nos dias 12 e 13 de Abril na ExpoCosmética
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de inscrição */}
            <div>
              <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.08)] relative overflow-hidden sticky top-24">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 uppercase tracking-widest text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Vagas Limitadas · 15 Lugares
                    </Badge>
                    <h3 className="font-black text-foreground uppercase tracking-wide text-base">Pedir Informações / Inscrição</h3>
                    <p className="text-xs text-muted-foreground mt-1">Preencha o formulário e entraremos em contacto brevemente</p>
                  </div>
                  <FormacaoForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">
              Pronto para transformar o seu salão?
            </h2>
            <p className="text-muted-foreground text-base mb-8">
              Experimente grátis — 2 simulações sem cartão, depois 7 dias grátis ao subscrever.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="text-base px-10 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]">
              Experimentar Grátis Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">Sem cartão necessário para as primeiras 2 simulações</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
              <Scissors className="h-3 w-3 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-widest uppercase text-foreground">Anjos Urbanos</span>
              <span className="text-xs tracking-widest text-muted-foreground uppercase ml-1">Virtual</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Anjos Urbanos Virtual. Todos os direitos reservados.
          </p>
          <a href="mailto:geral@anjosurbanosvirtual.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            geral@anjosurbanosvirtual.com
          </a>
        </div>
      </footer>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Scissors, Sparkles, Settings, LogOut, ExternalLink,
  Loader2, AlertCircle, CreditCard, Calendar, CheckCircle2,
  Zap, Lock, CheckCircle, ArrowRight, Palette
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const hasAccessQuery = trpc.subscription.hasAccess.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const salonQuery = trpc.salon.get.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const simulationStatusQuery = trpc.simulation.getStatus.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const recordUsageMutation = trpc.simulation.recordUsage.useMutation({
    onSuccess: () => {
      simulationStatusQuery.refetch();
      window.open("https://anjos-urbanos-virtual.netlify.app", "_blank");
    },
    onError: (err) => {
      if (err.data?.code === "FORBIDDEN") {
        setShowUpgradeModal(true);
      } else {
        toast.error("Erro ao registar simulação.");
      }
    },
  });

  const portalMutation = trpc.subscription.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("A redirecionar para o portal de faturação...");
        window.open(data.url, "_blank");
      }
    },
    onError: () => {
      toast.error("Não foi possível aceder ao portal de faturação.");
    },
  });

  const checkoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("A redirecionar para o pagamento...");
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error("Erro ao criar sessão de pagamento: " + err.message);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription") === "success") {
      toast.success("Subscrição activada com sucesso! Bem-vindo ao Anjos Urbanos Virtual.");
      window.history.replaceState({}, "", "/dashboard");
      hasAccessQuery.refetch();
      subscriptionQuery.refetch();
      simulationStatusQuery.refetch();
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

    const handleOpenTool = () => {
    const simStatus = simulationStatusQuery.data;
    // Admin tem sempre acesso ilimitado
    if (user?.role === "admin") {
      if (user?.email) localStorage.setItem('au_user_email', user.email);
      window.open("https://anjos-urbanos-virtual.netlify.app", "_blank");
      return;
    }
    if (!simStatus) return;
    if (simStatus.hasSubscription) {
      // Subscritores têm acesso ilimitado — guarda email para rastreio mas não conta
      if (user?.email) localStorage.setItem('au_user_email', user.email);
      window.open("https://anjos-urbanos-virtual.netlify.app", "_blank");
      return;
    }
    if (simStatus.freeUsed >= simStatus.freeLimit) {
      setShowUpgradeModal(true);
      return;
    }
    // Guarda o email no localStorage para a app Netlify reportar a geração
    // A contagem só acontece quando a IA gera uma imagem com sucesso
    if (user?.email) localStorage.setItem('au_user_email', user.email);
    window.open("https://anjos-urbanos-virtual.netlify.app", "_blank");
  };

  if (loading || hasAccessQuery.isLoading || simulationStatusQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sub = subscriptionQuery.data as any;
  const isAdmin = user?.role === "admin";
  const salonName = salonQuery.data?.name || user?.name || "O meu Salão";
  const simStatus = simulationStatusQuery.data;
  const freeUsed = simStatus?.freeUsed ?? 0;
  const freeLimit = simStatus?.freeLimit ?? 5;
  const hasSubscription = simStatus?.hasSubscription ?? false;
  const canSimulate = simStatus?.canSimulate ?? false;
  const freeRemaining = Math.max(0, freeLimit - freeUsed);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-widest uppercase text-foreground">Anjos Urbanos</span>
              <span className="block text-xs tracking-widest text-muted-foreground uppercase">Virtual</span>
            </div>
            {isAdmin && (
              <Badge className="ml-1 bg-primary/10 text-primary border-primary/30 uppercase text-xs tracking-wider">Admin</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setLocation("/admin")} className="border-border/50 hover:border-primary/50 uppercase text-xs tracking-wider">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={async () => { await logout(); setLocation("/"); }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase tracking-tight">
            Olá, {user?.name?.split(" ")[0] || "Bem-vindo"}
          </h1>
          <p className="text-muted-foreground text-sm">{salonName}</p>
        </div>

        {/* Main Action — AI Tool */}
        <Card className="mb-6 border border-primary/30 bg-card overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          <CardContent className="p-8 relative">
            {/* Linha 1: Assistente de Penteados */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground mb-1 uppercase tracking-tight">
                    Assistente de Penteados com IA
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Simule penteados para os seus clientes em tempo real. Carregue uma foto e explore diferentes estilos com inteligência artificial.
                  </p>

                  {/* Contador de simulações gratuitas */}
                  {!isAdmin && !hasSubscription && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: freeLimit }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-2 rounded-full ${i < freeUsed ? "bg-muted" : "bg-primary"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {freeRemaining > 0
                          ? `${freeRemaining} simulação${freeRemaining !== 1 ? "ões" : ""} gratuita${freeRemaining !== 1 ? "s" : ""} restante${freeRemaining !== 1 ? "s" : ""}`
                          : "Limite gratuito atingido"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="lg"
                className="shrink-0 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-50"
                onClick={handleOpenTool}
                disabled={recordUsageMutation.isPending || (!isAdmin && !hasSubscription && !canSimulate)}
              >
                {recordUsageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (!isAdmin && !hasSubscription && !canSimulate) ? (
                  <Lock className="h-4 w-4 mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                {(!isAdmin && !hasSubscription && !canSimulate) ? "Limite Atingido" : "Abrir Ferramenta IA"}
              </Button>
            </div>

            {/* Divisor */}
            <div className="my-6 border-t border-border/30" />

            {/* Linha 2: Análise de Cor de Cabelo */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-sm bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Palette className="h-7 w-7 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground mb-1 uppercase tracking-tight">
                    Análise de Cor de Cabelo
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Descubra a cor ideal para cada cliente com o Método Sazonal de 12 Estações. Análise por IA com paleta personalizada, técnicas e cores a evitar.
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                variant="outline"
                className="shrink-0 font-bold uppercase tracking-wider border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/60"
                onClick={() => setLocation('/color-analysis')}
              >
                <Palette className="h-4 w-4 mr-2" />
                Analisar Cor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Banner upgrade quando limite atingido */}
        {!isAdmin && !hasSubscription && freeRemaining === 0 && (
          <Card className="mb-6 border border-primary/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1 uppercase tracking-wide text-sm">Usou as 5 simulações gratuitas</p>
                    <p className="text-sm text-muted-foreground">
                      Subscreva por 29€/mês para simulações ilimitadas e acesso completo à plataforma.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation("/subscribe")}
                  className="shrink-0 uppercase text-xs tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  Subscrever Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <CreditCard className="h-4 w-4" />
                Estado da Subscrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground uppercase text-sm tracking-wide">Acesso Admin</span>
                </div>
              ) : hasSubscription ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground uppercase text-sm tracking-wide">Activa</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground uppercase text-sm tracking-wide">
                    Gratuito · {freeRemaining}/{freeLimit}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="h-4 w-4" />
                Próxima Renovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-bold text-foreground text-sm">
                {isAdmin ? "Sem expiração" : hasSubscription ? formatDate(sub?.currentPeriodEnd) : "—"}
              </span>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <Scissors className="h-4 w-4" />
                Plano Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground uppercase text-sm tracking-wide">
                  {isAdmin ? "Admin" : hasSubscription ? "Profissional" : "Gratuito"}
                </span>
                {!isAdmin && hasSubscription && <span className="text-muted-foreground text-sm">· 29€/mês</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Portal */}
        {!isAdmin && hasSubscription && sub?.status === "active" && (
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground mb-1 uppercase tracking-wide text-sm">Gerir Faturação</h3>
                  <p className="text-sm text-muted-foreground">
                    Actualize o método de pagamento, consulte faturas ou cancele a subscrição.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => portalMutation.mutate({ origin: window.location.origin })}
                  disabled={portalMutation.isPending}
                  className="border-border/50 hover:border-primary/50 uppercase text-xs tracking-wider"
                >
                  {portalMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  Portal de Faturação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Upgrade */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-card border border-primary/30 max-w-md">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-t-lg" />
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-center">
              Limite Gratuito Atingido
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Usou as suas <strong className="text-foreground">5 simulações gratuitas</strong>. Subscreva o plano profissional para simulações ilimitadas.
            </p>
            <div className="bg-background/50 rounded-lg p-4 mb-6 text-left space-y-2">
              {[
                "Simulações ilimitadas todos os dias",
                "Acesso em todos os dispositivos",
                "Suporte prioritário por email",
                "Cancele quando quiser",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-4xl font-black text-foreground">29€</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <Button
              className="w-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
              size="lg"
              onClick={() => {
                setShowUpgradeModal(false);
                checkoutMutation.mutate({ origin: window.location.origin });
              }}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscrever por 29€/mês
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <button
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowUpgradeModal(false)}
            >
              Talvez mais tarde
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

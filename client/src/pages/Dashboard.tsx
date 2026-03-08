import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Scissors, Sparkles, Settings, LogOut, ExternalLink,
  Loader2, AlertCircle, CreditCard, Calendar, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription") === "success") {
      toast.success("Subscrição activada com sucesso! Bem-vindo ao Anjos Urbanos Virtual.");
      window.history.replaceState({}, "", "/dashboard");
      hasAccessQuery.refetch();
      subscriptionQuery.refetch();
    }
  }, []);

  useEffect(() => {
    if (!loading && user && hasAccessQuery.data === false) {
      setLocation("/subscribe");
    }
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, hasAccessQuery.data, setLocation]);

  if (loading || hasAccessQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sub = subscriptionQuery.data as any;
  const isAdmin = user?.role === "admin";
  const salonName = salonQuery.data?.name || user?.name || "O meu Salão";

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
                </div>
              </div>
              <Button
                size="lg"
                className="shrink-0 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
                onClick={() => window.open("https://anjosurbanosvirtual.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Ferramenta IA
              </Button>
            </div>
          </CardContent>
        </Card>

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
              ) : sub?.status === "active" ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground uppercase text-sm tracking-wide">Activa</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <span className="font-bold text-foreground uppercase text-sm tracking-wide capitalize">{sub?.status || "Inactiva"}</span>
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
                {isAdmin ? "Sem expiração" : formatDate(sub?.currentPeriodEnd)}
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
                <span className="font-bold text-foreground uppercase text-sm tracking-wide">Profissional</span>
                {!isAdmin && <span className="text-muted-foreground text-sm">· 29€/mês</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Portal */}
        {!isAdmin && sub?.status === "active" && (
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

        {/* No subscription warning */}
        {!isAdmin && !subscriptionQuery.isLoading && (!sub || sub.status !== "active") && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground mb-1 uppercase tracking-wide text-sm">Subscrição não activa</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    A sua subscrição está inactiva. Active-a para continuar a usar o assistente IA.
                  </p>
                  <Button size="sm" onClick={() => setLocation("/subscribe")} className="uppercase text-xs tracking-wider">
                    Activar Subscrição
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

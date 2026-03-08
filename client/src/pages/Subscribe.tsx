import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight, Loader2, Scissors, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Subscribe() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const hasAccessQuery = trpc.subscription.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
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

  // Check URL params for success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") {
      toast.info("Pagamento cancelado. Pode tentar novamente quando quiser.");
    }
  }, []);

  // Redirect if already has access
  useEffect(() => {
    if (hasAccessQuery.data === true) {
      setLocation("/dashboard");
    }
  }, [hasAccessQuery.data, setLocation]);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    checkoutMutation.mutate({ origin: window.location.origin });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg text-foreground">Anjos Urbanos Virtual</span>
          </button>
        </div>
      </nav>

      <div className="container py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Activar Subscrição
            </h1>
            <p className="text-muted-foreground">
              Comece a usar o assistente de IA no seu salão hoje mesmo.
            </p>
          </div>

          {!isAuthenticated && (
            <Card className="border-amber-200 bg-amber-50 mb-6">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Precisa de iniciar sessão</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Para subscrever, precisa primeiro de criar uma conta ou iniciar sessão.
                  </p>
                  <Button size="sm" className="mt-3" onClick={() => window.location.href = getLoginUrl()}>
                    Iniciar Sessão
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                  "Suporte por email prioritário",
                  "Atualizações automáticas incluídas",
                  "Cancele quando quiser, sem penalizações",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full text-base"
                size="lg"
                onClick={handleSubscribe}
                disabled={checkoutMutation.isPending || !isAuthenticated}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    Subscrever por 29€/mês
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-4 text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Pagamento seguro processado pela Stripe
                </p>
                <p className="text-xs text-muted-foreground">
                  Para testar, use o cartão: <span className="font-mono font-medium">4242 4242 4242 4242</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar à página inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

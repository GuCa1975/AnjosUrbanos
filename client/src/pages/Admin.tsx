import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Scissors, Users, CreditCard, TrendingUp, ArrowLeft,
  Loader2, CheckCircle2, XCircle, AlertCircle, Euro, Zap, Activity
} from "lucide-react";
import { useEffect } from "react";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const statsQuery = trpc.admin.getStats.useQuery(undefined, {
    enabled: user?.role === "admin",
    retry: false,
  });

  const clientsQuery = trpc.admin.getClients.useQuery(undefined, {
    enabled: user?.role === "admin",
    retry: false,
  });

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      setLocation("/dashboard");
    }
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role !== "admin") return null;

  const stats = statsQuery.data;
  const clients = clientsQuery.data || [];
  const totalGenerations = clients.reduce((sum, c) => sum + (c.freeSimulations ?? 0), 0);
  const usersAtLimit = clients.filter(c => !c.subscription && (c.freeSimulations ?? 0) >= 5).length;

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 uppercase text-xs tracking-wider"><CheckCircle2 className="h-3 w-3 mr-1" />Activa</Badge>;
      case "canceled":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/10 uppercase text-xs tracking-wider"><XCircle className="h-3 w-3 mr-1" />Cancelada</Badge>;
      case "past_due":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/10 uppercase text-xs tracking-wider"><AlertCircle className="h-3 w-3 mr-1" />Em atraso</Badge>;
      case "trialing":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 uppercase text-xs tracking-wider">Trial</Badge>;
      default:
        return <Badge variant="secondary" className="uppercase text-xs tracking-wider">Sem sub.</Badge>;
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-muted-foreground hover:text-foreground uppercase text-xs tracking-wider">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
                <Scissors className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase text-foreground">Painel de Administração</span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30 uppercase text-xs tracking-wider">Admin</Badge>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase tracking-tight">
            Visão Geral
          </h1>
          <p className="text-muted-foreground text-sm">Gestão de clientes e subscrições</p>
        </div>

        {/* Stats */}
        {statsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="h-3.5 w-3.5" />
                  Utilizadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-foreground">{stats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Scissors className="h-3.5 w-3.5" />
                  Salões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-foreground">{stats.totalSalons}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <CreditCard className="h-3.5 w-3.5" />
                  Subscrições
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-primary">{stats.activeSubscriptions}</p>
              </CardContent>
            </Card>

            <Card className="border border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Euro className="h-3.5 w-3.5" />
                  Receita/mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-primary">{stats.monthlyRevenue}€</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Total de Gerações IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-foreground">{totalGenerations}</p>
                <p className="text-xs text-muted-foreground mt-1">simulações realizadas</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  Prontos para Converter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-amber-400">{usersAtLimit}</p>
                <p className="text-xs text-muted-foreground mt-1">atingiram o limite gratuito</p>
              </CardContent>
            </Card>
          </div>
          </>
        ) : null}

        {/* Clients Table */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider font-bold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Clientes e Subscrições
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm uppercase tracking-wider">Nenhum cliente registado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Utilizador</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Salão</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Subscrição</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Gerações IA</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Renovação</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground uppercase text-xs tracking-wider">Registado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(({ user: u, salon, subscription, freeSimulations, lastActivity }) => (
                      <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-bold text-foreground uppercase text-xs tracking-wide">{u.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{u.email || "—"}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-foreground text-xs">{salon?.name || <span className="text-muted-foreground italic">Sem salão</span>}</span>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(subscription?.status)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {subscription?.status === 'active' ? (
                            <span className="text-xs text-primary font-bold">Ilimitado</span>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-sm font-black ${
                                (freeSimulations ?? 0) >= 5 ? 'text-amber-400' :
                                (freeSimulations ?? 0) >= 3 ? 'text-yellow-400' :
                                'text-foreground'
                              }`}>{freeSimulations ?? 0}/5</span>
                              <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    (freeSimulations ?? 0) >= 5 ? 'bg-amber-400' :
                                    (freeSimulations ?? 0) >= 3 ? 'bg-yellow-400' :
                                    'bg-primary'
                                  }`}
                                  style={{ width: `${Math.min(100, ((freeSimulations ?? 0) / 5) * 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {formatDate(subscription?.currentPeriodEnd)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

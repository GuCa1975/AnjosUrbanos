import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Scissors, Users, CreditCard, TrendingUp, ArrowLeft,
  Loader2, CheckCircle2, XCircle, AlertCircle, Euro
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

  // Redirect if not admin
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role !== "admin") return null;

  const stats = statsQuery.data;
  const clients = clientsQuery.data || [];

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Activa</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Cancelada</Badge>;
      case "past_due":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"><AlertCircle className="h-3 w-3 mr-1" />Em atraso</Badge>;
      case "trialing":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Trial</Badge>;
      default:
        return <Badge variant="secondary">Sem subscrição</Badge>;
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Scissors className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-base text-foreground">Painel de Administração</span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            Visão Geral
          </h1>
          <p className="text-muted-foreground">Gestão de clientes e subscrições</p>
        </div>

        {/* Stats */}
        {statsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Total Utilizadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground font-display">{stats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Scissors className="h-3.5 w-3.5" />
                  Total Salões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground font-display">{stats.totalSalons}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Subscrições Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 font-display">{stats.activeSubscriptions}</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Euro className="h-3.5 w-3.5" />
                  Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary font-display">{stats.monthlyRevenue}€</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
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
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum cliente registado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Utilizador</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Salão</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Subscrição</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Renovação</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Registado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(({ user: u, salon, subscription }) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-foreground">{u.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{u.email || "—"}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-foreground">{salon?.name || <span className="text-muted-foreground italic">Sem salão</span>}</span>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(subscription?.status)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {formatDate(subscription?.currentPeriodEnd)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
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

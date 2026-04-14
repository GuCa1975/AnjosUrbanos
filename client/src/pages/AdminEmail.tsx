import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Mail, ArrowLeft, Loader2, Send, Users, CheckCircle2, AlertCircle, FlaskConical } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const AUDIENCE_OPTIONS = [
  {
    value: "all" as const,
    label: "Todos os utilizadores",
    description: "Todos os cabeleireiros registados na plataforma",
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: "free_only" as const,
    label: "Sem subscrição activa",
    description: "Utilizadores que ainda não subscreveram (plano gratuito)",
    icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
  },
  {
    value: "limit_reached" as const,
    label: "Limite gratuito atingido",
    description: "Utilizadores que esgotaram as 5 simulações gratuitas — os mais quentes para converter",
    icon: <AlertCircle className="h-4 w-4 text-red-400" />,
  },
];

const DEFAULT_SUBJECT = "Já experimentaste — agora imagina usar isto todos os dias no teu salão";

const DEFAULT_MESSAGE = `Sou o Carlos.

Há uns dias experimentaste a Anjos Urbanos Virtual — e isso significa muito para mim, porque esta ferramenta nasceu de anos a trabalhar atrás de uma cadeira de cabeleireiro.

Quando criei a Anjos Urbanos Virtual, queria uma coisa simples: que o cliente pudesse ver, antes de começar, exatamente como ia ficar. E que tu, como profissional, pudesses trabalhar com confiança total.

Já testaste. Já viste como funciona.

Agora imagina ter isso disponível em cada consulta, com cada cliente, todos os dias.

A subscrição mensal dá-te acesso ilimitado à plataforma, em qualquer dispositivo, sem complicações. E neste momento, tens a oportunidade de entrar antes de esta ferramenta se tornar o novo padrão do setor.

Se ainda não deste o passo, este é o momento certo.

Um abraço,
Carlos Almeida`;

export default function AdminEmail() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [audience, setAudience] = useState<"all" | "free_only" | "limit_reached">("limit_reached");
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testSent, setTestSent] = useState(false);

  const sendTestEmail = trpc.admin.sendCampaign.useMutation({
    onSuccess: () => {
      setTestSent(true);
      setResult(null); // limpar resultado de campanha anterior
      toast.success(`✓ Email de teste enviado para ${testEmail}! Verifica a caixa de entrada.`, { duration: 6000 });
      setTimeout(() => setTestSent(false), 5000);
    },
    onError: (err) => {
      toast.error(`Erro ao enviar teste: ${err.message}`);
    },
  });

  const sendCampaign = trpc.admin.sendCampaign.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Campanha enviada! ${data.sent} emails enviados com sucesso.`);
    },
    onError: (err) => {
      toast.error(`Erro ao enviar: ${err.message}`);
    },
  });

  useEffect(() => {
    if (!loading && user && user.role !== "admin") setLocation("/dashboard");
    if (!loading && !user) setLocation("/");
  }, [loading, user, setLocation]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role !== "admin") return null;

  const handleSendTest = () => {
    if (!testEmail.trim() || !testEmail.includes("@")) {
      toast.error("Introduz um email de teste válido.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Preenche o assunto e a mensagem antes de enviar o teste.");
      return;
    }
    sendTestEmail.mutate({ subject, message, audience: "test", testEmail });
  };

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Preenche o assunto e a mensagem antes de enviar.");
      return;
    }
    sendCampaign.mutate({ subject, message, audience });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="text-muted-foreground hover:text-foreground uppercase text-xs tracking-wider"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Admin
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
                <Mail className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase text-foreground">
                Campanhas de Email
              </span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30 uppercase text-xs tracking-wider">
            Admin
          </Badge>
        </div>
      </header>

      <div className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase tracking-tight">
            Enviar Campanha
          </h1>
          <p className="text-muted-foreground text-sm">
            Envia um email personalizado aos utilizadores da plataforma diretamente de{" "}
            <span className="text-primary">geral@anjosurbanosvirtual.com</span>
          </p>
        </div>

        {/* Audience selector */}
        <Card className="border-border/50 bg-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              Destinatários
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {AUDIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAudience(opt.value)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  audience === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border/50 bg-background hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      audience === opt.value ? "border-primary" : "border-border"
                    }`}
                  >
                    {audience === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span className="font-bold text-sm text-foreground">{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Subject */}
        <Card className="border-border/50 bg-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              Assunto do Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Assunto do email..."
            />
          </CardContent>
        </Card>

        {/* Message */}
        <Card className="border-border/50 bg-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={14}
              className="w-full bg-background border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none font-mono leading-relaxed"
              placeholder="Escreve a tua mensagem aqui..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              Cada parágrafo separado por linha em branco será formatado automaticamente no email.
            </p>
          </CardContent>
        </Card>

        {/* Test email */}
        <Card className="border-amber-500/20 bg-amber-500/5 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
              <FlaskConical className="h-3.5 w-3.5" />
              Enviar Email de Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Envia o email apenas para ti antes de disparar para toda a lista. Confirma que está tudo certo.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 bg-background border border-border/50 rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="teu@email.com"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendTest}
                disabled={sendTestEmail.isPending || testSent}
                className="h-10 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-amber-500/30 hover:border-amber-400 hover:text-amber-400"
              >
                {sendTestEmail.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : testSent ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-primary" /> Enviado</>
                ) : (
                  <><FlaskConical className="h-3.5 w-3.5 mr-1" /> Testar</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground text-sm">
                    Campanha enviada com sucesso!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.sent} emails enviados · {result.failed} falharam · {result.total} destinatários no total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={sendCampaign.isPending}
          className="w-full h-12 text-sm font-bold uppercase tracking-widest"
          size="lg"
        >
          {sendCampaign.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              A enviar emails...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Campanha
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

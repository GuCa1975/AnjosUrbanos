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

type Lang = "pt" | "es" | "en" | "it";

const translations: Record<Lang, Record<string, string>> = {
  pt: {
    dashboard: "Dashboard", activateSubscription: "Activar Subscrição", login: "Entrar", startNow: "Começar Agora",
    heroSubtitle: "Powered by Gemini AI", heroTitle1: "More Than", heroTitle2: "Hairstyle",
    heroDesc: "Mostre aos seus clientes o resultado final antes de qualquer corte ou coloração. Aumente a confiança e eleve a experiência do seu salão.",
    tryNow: "Experimentar Agora", seePrices: "Ver Preços",
    badge5sims: "5 simulações gratuitas", badge7days: "7 dias grátis ao subscrever", badgeNoCard: "Sem cartão para experimentar",
    featuresTitle: "Tudo o que o seu salão precisa",
    featuresDesc: "Uma plataforma completa desenvolvida especialmente para profissionais de cabeleireiro em Portugal.",
    feat1Title: "Simulação de Penteados com IA", feat1Desc: "Mostre aos seus clientes como ficam com diferentes penteados antes de qualquer corte. Tecnologia de ponta ao serviço do seu salão.",
    feat2Title: "Acesso Seguro e Exclusivo", feat2Desc: "Cada salão tem o seu acesso privado. Os seus dados e os dos seus clientes estão sempre protegidos.",
    feat3Title: "Painel de Gestão", feat3Desc: "Gira a sua subscrição, consulte o histórico e controle tudo a partir de um painel intuitivo.",
    feat4Title: "Ferramenta Profissional", feat4Desc: "Desenvolvida especificamente para cabeleireiros profissionais. Simples de usar, poderosa nos resultados.",
    pricingTitle: "Preço simples e transparente", pricingDesc: "Um único plano com tudo incluído. Sem surpresas.",
    planBadge: "Plano Profissional", perMonth: "/mês", perSalon: "por salão · faturação mensal", trialBadge: "7 dias grátis",
    pricingItem1: "7 dias gratuitos para experimentar", pricingItem2: "Simulação de penteados com IA ilimitada",
    pricingItem3: "Assistente virtual para clientes", pricingItem4: "Painel de gestão do salão",
    pricingItem5: "Suporte por email", pricingItem6: "Actualizações incluídas",
    startTrial: "Começar com 7 dias grátis", trialNote: "7 dias gratuitos · depois 29€/mês · cancele quando quiser", questions: "Tem dúvidas?",
    testimonialsTitle: "O que dizem os nossos clientes",
    test1Text: "Os meus clientes adoram ver o resultado antes de decidirem. As vendas de serviços premium aumentaram 40%.", test1Name: "Maria Santos", test1Salon: "Salão Elegance, Lisboa",
    test2Text: "Uma ferramenta indispensável. Economizo tempo nas consultas e os clientes saem sempre satisfeitos.", test2Name: "João Ferreira", test2Salon: "Hair Studio Porto",
    test3Text: "Simples de usar e os resultados são impressionantes. Recomendo a todos os colegas.", test3Name: "Ana Costa", test3Salon: "Beleza & Arte, Braga",
    eventBadge: "Evento Presencial", expoTitle: "Venha Conhecer-nos na",
    expoDesc: "Experimente a app ao vivo, fale com a nossa equipa e descubra como a Inteligência Artificial pode transformar o seu salão. Entrada gratuita no stand.",
    expoStudio: "Anjos Urbanos® Estúdio Virtual", expoLive: "Demonstração ao vivo · Entrada gratuita",
    expoDates: "12 e 13 de Abril de 2026", expoStand: "Stand da Associação de Cabeleireiros de Portugal",
    expoSim: "Simulação ao vivo com o seu próprio telemóvel", expoFree: "Entrada gratuita para profissionais",
    expoVisit: "Visite-nos", expoVisitDesc: "Venha experimentar a tecnologia em primeira mão. A nossa equipa estará disponível para demonstrações personalizadas.",
    formacaoBadge: "Formação Profissional", formacaoTitle: "Formação de IA para Cabeleireiros",
    formacaoDesc: "Aprenda a dominar as ferramentas de Inteligência Artificial para transformar o seu negócio. Formação prática e intensiva.",
    formacaoDate: "1 de Junho de 2026", formacaoLocal: "Associação de Cabeleireiros de Portugal, Porto", formacaoDuration: "1 dia · 9h00 às 18h00", formacaoSpots: "15 vagas disponíveis",
    formacaoProgram: "Programa da Formação",
    prog1: "Introdução à IA no sector da beleza", prog2: "Prática com a ferramenta Anjos Urbanos Virtual",
    prog3: "Estratégias de venda com simulação de penteados", prog4: "Marketing digital para cabeleireiros", prog5: "Casos práticos e simulações reais",
    formacaoPrices: "Preços", socios: "Sócios da Associação", naoSocios: "Não Sócios", precoNormal: "Preço normal",
    inscricaoFeira: "Inscrição na Feira", descontoExpo: "Desconto exclusivo ExpoCosmética", sociosENaoSocios: "sócios e não sócios",
    discountNote: "* Desconto de feira válido apenas para inscrições realizadas nos dias 12 e 13 de Abril na ExpoCosmética",
    vagasLimitadas: "Vagas Limitadas · 15 Lugares", formTitle: "Pedir Informações / Inscrição", formDesc: "Preencha o formulário e entraremos em contacto brevemente",
    formNome: "Nome Completo *", formTelefone: "Telefone *", formEmail: "Email *", formMensagem: "Mensagem (opcional)",
    formMensagemPlaceholder: "Dúvidas, tipo de inscrição (sócio/não sócio/feira)...", formSubmit: "Enviar Pedido de Inscrição",
    formSentTo: "O seu pedido será enviado para", formSentTitle: "Pedido Enviado!",
    formSentDesc: "O seu cliente de email foi aberto com os dados preenchidos. Envie o email para completar a inscrição.",
    formSentNote: "Será contactado pela Associação de Cabeleireiros de Portugal em breve.", formSendAnother: "Enviar outro pedido",
    ctaTitle: "Pronto para transformar o seu salão?", ctaDesc: "Experimente grátis — 5 simulações sem cartão, depois 7 dias grátis ao subscrever.",
    ctaBtn: "Experimentar Grátis Agora", ctaNote: "Sem cartão necessário para as primeiras 5 simulações", rights: "Todos os direitos reservados.",
  },
  es: {
    dashboard: "Panel", activateSubscription: "Activar Suscripción", login: "Entrar", startNow: "Empezar Ahora",
    heroSubtitle: "Powered by Gemini AI", heroTitle1: "More Than", heroTitle2: "Hairstyle",
    heroDesc: "Muestre a sus clientes el resultado final antes de cualquier corte o coloración. Aumente la confianza y eleve la experiencia de su salón.",
    tryNow: "Probar Ahora", seePrices: "Ver Precios",
    badge5sims: "5 simulaciones gratuitas", badge7days: "7 días gratis al suscribirse", badgeNoCard: "Sin tarjeta para probar",
    featuresTitle: "Todo lo que su salón necesita",
    featuresDesc: "Una plataforma completa desarrollada especialmente para profesionales de peluquería.",
    feat1Title: "Simulación de Peinados con IA", feat1Desc: "Muestre a sus clientes cómo quedarían con diferentes peinados antes de cualquier corte. Tecnología de vanguardia al servicio de su salón.",
    feat2Title: "Acceso Seguro y Exclusivo", feat2Desc: "Cada salón tiene su acceso privado. Sus datos y los de sus clientes están siempre protegidos.",
    feat3Title: "Panel de Gestión", feat3Desc: "Gestione su suscripción, consulte el historial y controle todo desde un panel intuitivo.",
    feat4Title: "Herramienta Profesional", feat4Desc: "Desarrollada específicamente para peluqueros profesionales. Fácil de usar, potente en resultados.",
    pricingTitle: "Precio simple y transparente", pricingDesc: "Un único plan con todo incluido. Sin sorpresas.",
    planBadge: "Plan Profesional", perMonth: "/mes", perSalon: "por salón · facturación mensual", trialBadge: "7 días gratis",
    pricingItem1: "7 días gratuitos para probar", pricingItem2: "Simulación de peinados con IA ilimitada",
    pricingItem3: "Asistente virtual para clientes", pricingItem4: "Panel de gestión del salón",
    pricingItem5: "Soporte por email", pricingItem6: "Actualizaciones incluidas",
    startTrial: "Empezar con 7 días gratis", trialNote: "7 días gratuitos · luego 29€/mes · cancele cuando quiera", questions: "¿Tiene dudas?",
    testimonialsTitle: "Lo que dicen nuestros clientes",
    test1Text: "Mis clientes adoran ver el resultado antes de decidir. Las ventas de servicios premium aumentaron un 40%.", test1Name: "María Santos", test1Salon: "Salón Elegance, Lisboa",
    test2Text: "Una herramienta indispensable. Ahorro tiempo en las consultas y los clientes siempre salen satisfechos.", test2Name: "Juan Ferreira", test2Salon: "Hair Studio Porto",
    test3Text: "Fácil de usar y los resultados son impresionantes. Se la recomiendo a todos mis colegas.", test3Name: "Ana Costa", test3Salon: "Beleza & Arte, Braga",
    eventBadge: "Evento Presencial", expoTitle: "Visítenos en la",
    expoDesc: "Pruebe la app en vivo, hable con nuestro equipo y descubra cómo la Inteligencia Artificial puede transformar su salón. Entrada gratuita en el stand.",
    expoStudio: "Anjos Urbanos® Estudio Virtual", expoLive: "Demostración en vivo · Entrada gratuita",
    expoDates: "12 y 13 de Abril de 2026", expoStand: "Stand de la Asociación de Peluqueros de Portugal",
    expoSim: "Simulación en vivo con su propio teléfono", expoFree: "Entrada gratuita para profesionales",
    expoVisit: "Visítenos", expoVisitDesc: "Venga a probar la tecnología de primera mano. Nuestro equipo estará disponible para demostraciones personalizadas.",
    formacaoBadge: "Formación Profesional", formacaoTitle: "Formación de IA para Peluqueros",
    formacaoDesc: "Aprenda a dominar las herramientas de Inteligencia Artificial para transformar su negocio. Formación práctica e intensiva.",
    formacaoDate: "1 de Junio de 2026", formacaoLocal: "Asociación de Peluqueros de Portugal, Oporto", formacaoDuration: "1 día · 9h00 a 18h00", formacaoSpots: "15 plazas disponibles",
    formacaoProgram: "Programa de Formación",
    prog1: "Introducción a la IA en el sector de la belleza", prog2: "Práctica con la herramienta Anjos Urbanos Virtual",
    prog3: "Estrategias de venta con simulación de peinados", prog4: "Marketing digital para peluqueros", prog5: "Casos prácticos y simulaciones reales",
    formacaoPrices: "Precios", socios: "Socios de la Asociación", naoSocios: "No Socios", precoNormal: "Precio normal",
    inscricaoFeira: "Inscripción en la Feria", descontoExpo: "Descuento exclusivo ExpoCosmética", sociosENaoSocios: "socios y no socios",
    discountNote: "* Descuento de feria válido solo para inscripciones realizadas los días 12 y 13 de Abril en ExpoCosmética",
    vagasLimitadas: "Plazas Limitadas · 15 Lugares", formTitle: "Pedir Información / Inscripción", formDesc: "Rellene el formulario y nos pondremos en contacto brevemente",
    formNome: "Nombre Completo *", formTelefone: "Teléfono *", formEmail: "Email *", formMensagem: "Mensaje (opcional)",
    formMensagemPlaceholder: "Dudas, tipo de inscripción (socio/no socio/feria)...", formSubmit: "Enviar Solicitud de Inscripción",
    formSentTo: "Su solicitud será enviada a", formSentTitle: "¡Solicitud Enviada!",
    formSentDesc: "Su cliente de email se abrió con los datos rellenados. Envíe el email para completar la inscripción.",
    formSentNote: "Será contactado por la Asociación de Peluqueros de Portugal en breve.", formSendAnother: "Enviar otra solicitud",
    ctaTitle: "¿Listo para transformar su salón?", ctaDesc: "Pruebe gratis — 5 simulaciones sin tarjeta, luego 7 días gratis al suscribirse.",
    ctaBtn: "Probar Gratis Ahora", ctaNote: "Sin tarjeta necesaria para las primeras 5 simulaciones", rights: "Todos los derechos reservados.",
  },
  en: {
    dashboard: "Dashboard", activateSubscription: "Activate Subscription", login: "Sign In", startNow: "Get Started",
    heroSubtitle: "Powered by Gemini AI", heroTitle1: "More Than", heroTitle2: "Hairstyle",
    heroDesc: "Show your clients the final result before any cut or colour. Boost confidence and elevate your salon experience.",
    tryNow: "Try Now", seePrices: "See Pricing",
    badge5sims: "5 free simulations", badge7days: "7-day free trial on subscribe", badgeNoCard: "No card to try",
    featuresTitle: "Everything your salon needs",
    featuresDesc: "A complete platform built specifically for professional hairstylists.",
    feat1Title: "AI Hairstyle Simulation", feat1Desc: "Show clients how they'd look with different hairstyles before any cut. Cutting-edge technology at your salon's service.",
    feat2Title: "Secure & Exclusive Access", feat2Desc: "Each salon has its own private access. Your data and your clients' data are always protected.",
    feat3Title: "Management Dashboard", feat3Desc: "Manage your subscription, check history and control everything from an intuitive dashboard.",
    feat4Title: "Professional Tool", feat4Desc: "Built specifically for professional hairstylists. Simple to use, powerful in results.",
    pricingTitle: "Simple, transparent pricing", pricingDesc: "One plan with everything included. No surprises.",
    planBadge: "Professional Plan", perMonth: "/month", perSalon: "per salon · monthly billing", trialBadge: "7 days free",
    pricingItem1: "7-day free trial", pricingItem2: "Unlimited AI hairstyle simulation",
    pricingItem3: "Virtual assistant for clients", pricingItem4: "Salon management dashboard",
    pricingItem5: "Email support", pricingItem6: "Updates included",
    startTrial: "Start 7-day free trial", trialNote: "7 days free · then €29/month · cancel anytime", questions: "Have questions?",
    testimonialsTitle: "What our clients say",
    test1Text: "My clients love seeing the result before deciding. Premium service sales increased by 40%.", test1Name: "Maria Santos", test1Salon: "Salão Elegance, Lisbon",
    test2Text: "An indispensable tool. I save time in consultations and clients always leave satisfied.", test2Name: "João Ferreira", test2Salon: "Hair Studio Porto",
    test3Text: "Easy to use and the results are impressive. I recommend it to all my colleagues.", test3Name: "Ana Costa", test3Salon: "Beleza & Arte, Braga",
    eventBadge: "In-Person Event", expoTitle: "Visit us at",
    expoDesc: "Try the app live, talk to our team and discover how Artificial Intelligence can transform your salon. Free entry at the stand.",
    expoStudio: "Anjos Urbanos® Virtual Studio", expoLive: "Live demonstration · Free entry",
    expoDates: "April 12 & 13, 2026", expoStand: "Portuguese Hairdressers Association Stand",
    expoSim: "Live simulation with your own phone", expoFree: "Free entry for professionals",
    expoVisit: "Visit us", expoVisitDesc: "Come and experience the technology first-hand. Our team will be available for personalised demonstrations.",
    formacaoBadge: "Professional Training", formacaoTitle: "AI Training for Hairstylists",
    formacaoDesc: "Learn to master Artificial Intelligence tools to transform your business. Practical and intensive training.",
    formacaoDate: "June 1, 2026", formacaoLocal: "Portuguese Hairdressers Association, Porto", formacaoDuration: "1 day · 9am to 6pm", formacaoSpots: "15 spots available",
    formacaoProgram: "Training Programme",
    prog1: "Introduction to AI in the beauty sector", prog2: "Hands-on with Anjos Urbanos Virtual tool",
    prog3: "Sales strategies with hairstyle simulation", prog4: "Digital marketing for hairstylists", prog5: "Practical cases and real simulations",
    formacaoPrices: "Prices", socios: "Association Members", naoSocios: "Non-Members", precoNormal: "Regular price",
    inscricaoFeira: "Fair Registration", descontoExpo: "Exclusive ExpoCosmética discount", sociosENaoSocios: "members and non-members",
    discountNote: "* Fair discount valid only for registrations made on April 12 & 13 at ExpoCosmética",
    vagasLimitadas: "Limited Spots · 15 Places", formTitle: "Request Information / Registration", formDesc: "Fill in the form and we'll get in touch shortly",
    formNome: "Full Name *", formTelefone: "Phone *", formEmail: "Email *", formMensagem: "Message (optional)",
    formMensagemPlaceholder: "Questions, registration type (member/non-member/fair)...", formSubmit: "Send Registration Request",
    formSentTo: "Your request will be sent to", formSentTitle: "Request Sent!",
    formSentDesc: "Your email client opened with the details filled in. Send the email to complete the registration.",
    formSentNote: "You will be contacted by the Portuguese Hairdressers Association shortly.", formSendAnother: "Send another request",
    ctaTitle: "Ready to transform your salon?", ctaDesc: "Try for free — 5 simulations without a card, then 7 days free on subscribe.",
    ctaBtn: "Try for Free Now", ctaNote: "No card required for the first 5 simulations", rights: "All rights reserved.",
  },
  it: {
    dashboard: "Dashboard", activateSubscription: "Attiva Abbonamento", login: "Accedi", startNow: "Inizia Ora",
    heroSubtitle: "Powered by Gemini AI", heroTitle1: "More Than", heroTitle2: "Hairstyle",
    heroDesc: "Mostra ai tuoi clienti il risultato finale prima di qualsiasi taglio o colorazione. Aumenta la fiducia e migliora l'esperienza del tuo salone.",
    tryNow: "Prova Ora", seePrices: "Vedi Prezzi",
    badge5sims: "5 simulazioni gratuite", badge7days: "7 giorni gratis con l'abbonamento", badgeNoCard: "Senza carta per provare",
    featuresTitle: "Tutto ciò di cui il tuo salone ha bisogno",
    featuresDesc: "Una piattaforma completa sviluppata appositamente per parrucchieri professionisti.",
    feat1Title: "Simulazione Acconciature con IA", feat1Desc: "Mostra ai clienti come apparirebbero con diverse acconciature prima di qualsiasi taglio. Tecnologia all'avanguardia al servizio del tuo salone.",
    feat2Title: "Accesso Sicuro ed Esclusivo", feat2Desc: "Ogni salone ha il proprio accesso privato. I tuoi dati e quelli dei tuoi clienti sono sempre protetti.",
    feat3Title: "Pannello di Gestione", feat3Desc: "Gestisci il tuo abbonamento, consulta lo storico e controlla tutto da un pannello intuitivo.",
    feat4Title: "Strumento Professionale", feat4Desc: "Sviluppato specificamente per parrucchieri professionisti. Semplice da usare, potente nei risultati.",
    pricingTitle: "Prezzo semplice e trasparente", pricingDesc: "Un unico piano con tutto incluso. Senza sorprese.",
    planBadge: "Piano Professionale", perMonth: "/mese", perSalon: "per salone · fatturazione mensile", trialBadge: "7 giorni gratis",
    pricingItem1: "7 giorni gratuiti per provare", pricingItem2: "Simulazione acconciature con IA illimitata",
    pricingItem3: "Assistente virtuale per clienti", pricingItem4: "Pannello di gestione del salone",
    pricingItem5: "Supporto via email", pricingItem6: "Aggiornamenti inclusi",
    startTrial: "Inizia con 7 giorni gratis", trialNote: "7 giorni gratis · poi 29€/mese · cancella quando vuoi", questions: "Hai domande?",
    testimonialsTitle: "Cosa dicono i nostri clienti",
    test1Text: "I miei clienti adorano vedere il risultato prima di decidere. Le vendite di servizi premium sono aumentate del 40%.", test1Name: "Maria Santos", test1Salon: "Salão Elegance, Lisbona",
    test2Text: "Uno strumento indispensabile. Risparmio tempo nelle consulenze e i clienti escono sempre soddisfatti.", test2Name: "João Ferreira", test2Salon: "Hair Studio Porto",
    test3Text: "Facile da usare e i risultati sono impressionanti. Lo consiglio a tutti i colleghi.", test3Name: "Ana Costa", test3Salon: "Beleza & Arte, Braga",
    eventBadge: "Evento dal Vivo", expoTitle: "Vieni a trovarci alla",
    expoDesc: "Prova l'app dal vivo, parla con il nostro team e scopri come l'Intelligenza Artificiale può trasformare il tuo salone. Ingresso gratuito allo stand.",
    expoStudio: "Anjos Urbanos® Studio Virtuale", expoLive: "Dimostrazione dal vivo · Ingresso gratuito",
    expoDates: "12 e 13 Aprile 2026", expoStand: "Stand dell'Associazione Parrucchieri del Portogallo",
    expoSim: "Simulazione dal vivo con il tuo telefono", expoFree: "Ingresso gratuito per professionisti",
    expoVisit: "Vieni a trovarci", expoVisitDesc: "Vieni a provare la tecnologia in prima persona. Il nostro team sarà disponibile per dimostrazioni personalizzate.",
    formacaoBadge: "Formazione Professionale", formacaoTitle: "Formazione IA per Parrucchieri",
    formacaoDesc: "Impara a padroneggiare gli strumenti di Intelligenza Artificiale per trasformare il tuo business. Formazione pratica e intensiva.",
    formacaoDate: "1 Giugno 2026", formacaoLocal: "Associazione Parrucchieri del Portogallo, Porto", formacaoDuration: "1 giorno · 9:00 alle 18:00", formacaoSpots: "15 posti disponibili",
    formacaoProgram: "Programma della Formazione",
    prog1: "Introduzione all'IA nel settore della bellezza", prog2: "Pratica con lo strumento Anjos Urbanos Virtual",
    prog3: "Strategie di vendita con simulazione acconciature", prog4: "Marketing digitale per parrucchieri", prog5: "Casi pratici e simulazioni reali",
    formacaoPrices: "Prezzi", socios: "Soci dell'Associazione", naoSocios: "Non Soci", precoNormal: "Prezzo normale",
    inscricaoFeira: "Iscrizione alla Fiera", descontoExpo: "Sconto esclusivo ExpoCosmética", sociosENaoSocios: "soci e non soci",
    discountNote: "* Sconto fiera valido solo per iscrizioni effettuate il 12 e 13 Aprile all'ExpoCosmética",
    vagasLimitadas: "Posti Limitati · 15 Luoghi", formTitle: "Richiedi Informazioni / Iscrizione", formDesc: "Compila il modulo e ti contatteremo a breve",
    formNome: "Nome Completo *", formTelefone: "Telefono *", formEmail: "Email *", formMensagem: "Messaggio (opzionale)",
    formMensagemPlaceholder: "Domande, tipo di iscrizione (socio/non socio/fiera)...", formSubmit: "Invia Richiesta di Iscrizione",
    formSentTo: "La tua richiesta sarà inviata a", formSentTitle: "Richiesta Inviata!",
    formSentDesc: "Il tuo client email è stato aperto con i dati compilati. Invia l'email per completare l'iscrizione.",
    formSentNote: "Sarai contattato dall'Associazione Parrucchieri del Portogallo a breve.", formSendAnother: "Invia un'altra richiesta",
    ctaTitle: "Pronto a trasformare il tuo salone?", ctaDesc: "Prova gratis — 5 simulazioni senza carta, poi 7 giorni gratis con l'abbonamento.",
    ctaBtn: "Prova Gratis Ora", ctaNote: "Nessuna carta necessaria per le prime 5 simulazioni", rights: "Tutti i diritti riservati.",
  },
};

function FormacaoForm({ lang, tr }: { lang: Lang; tr: Record<string, string> }) {
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Inscrição Formação IA para Cabeleireiros — 1 Junho 2026');
    const body = encodeURIComponent(
      `Nome: ${formData.nome}\nTelefone: ${formData.telefone}\nEmail: ${formData.email}\n\nMensagem:\n${formData.mensagem || '(sem mensagem adicional)'}`
    );
    window.open(`mailto:hairschoolacp@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setEnviado(true);
  };
  if (enviado) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-black text-foreground uppercase tracking-wide text-sm mb-2">{tr.formSentTitle}</h4>
        <p className="text-sm text-muted-foreground mb-4">{tr.formSentDesc}</p>
        <p className="text-xs text-muted-foreground">{tr.formSentNote}</p>
        <button onClick={() => setEnviado(false)} className="mt-4 text-xs text-primary hover:underline">{tr.formSendAnother}</button>
      </div>
    );
  }
  const phonePlaceholder = lang === "en" ? "+44 7XX XXX XXXX" : lang === "es" ? "+34 6XX XXX XXX" : lang === "it" ? "+39 3XX XXX XXXX" : "+351 9XX XXX XXX";
  const namePlaceholder = lang === "en" ? "Your full name" : lang === "es" ? "Su nombre completo" : lang === "it" ? "Il tuo nome completo" : "O seu nome";
  const emailPlaceholder = lang === "en" ? "your@email.com" : lang === "es" ? "su@email.com" : lang === "it" ? "tua@email.com" : "o.seu@email.com";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <User className="h-3 w-3" /> {tr.formNome}
        </Label>
        <Input id="nome" required placeholder={namePlaceholder} value={formData.nome}
          onChange={(e) => setFormData(p => ({ ...p, nome: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="telefone" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" /> {tr.formTelefone}
        </Label>
        <Input id="telefone" required type="tel" placeholder={phonePlaceholder} value={formData.telefone}
          onChange={(e) => setFormData(p => ({ ...p, telefone: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Mail className="h-3 w-3" /> {tr.formEmail}
        </Label>
        <Input id="email" required type="email" placeholder={emailPlaceholder} value={formData.email}
          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mensagem" className="text-xs uppercase tracking-wider text-muted-foreground">
          {tr.formMensagem}
        </Label>
        <Textarea id="mensagem" placeholder={tr.formMensagemPlaceholder} value={formData.mensagem}
          onChange={(e) => setFormData(p => ({ ...p, mensagem: e.target.value }))}
          className="bg-background border-border/50 focus:border-primary/50 resize-none" rows={3} />
      </div>
      <Button type="submit" className="w-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]" size="lg">
        <Mail className="mr-2 h-4 w-4" />
        {tr.formSubmit}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        {tr.formSentTo}{" "}
        <a href="mailto:hairschoolacp@gmail.com" className="text-primary hover:underline">hairschoolacp@gmail.com</a>
      </p>
    </form>
  );
}

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<Lang>("pt");
  const tr = translations[lang];

  const hasAccessQuery = trpc.subscription.hasAccess.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user?.role === 'admin' || hasAccessQuery.data) {
      setLocation("/dashboard");
    } else {
      setLocation("/subscribe");
    }
  };

  const features = [
    { icon: Sparkles, title: tr.feat1Title, description: tr.feat1Desc },
    { icon: Shield, title: tr.feat2Title, description: tr.feat2Desc },
    { icon: BarChart3, title: tr.feat3Title, description: tr.feat3Desc },
    { icon: Scissors, title: tr.feat4Title, description: tr.feat4Desc },
  ];

  const testimonials = [
    { name: tr.test1Name, salon: tr.test1Salon, text: tr.test1Text },
    { name: tr.test2Name, salon: tr.test2Salon, text: tr.test2Text },
    { name: tr.test3Name, salon: tr.test3Salon, text: tr.test3Text },
  ];

  const LangBtn = ({ l, label }: { l: Lang; label: string }) => (
    <button
      onClick={() => setLang(l)}
      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
        lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

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
            {/* Language selector */}
            <div className="flex items-center gap-0.5 border border-border/50 rounded px-1 py-0.5">
              <LangBtn l="pt" label="PT" />
              <span className="text-border text-xs px-0.5">|</span>
              <LangBtn l="es" label="ES" />
              <span className="text-border text-xs px-0.5">|</span>
              <LangBtn l="en" label="EN" />
              <span className="text-border text-xs px-0.5">|</span>
              <LangBtn l="it" label="IT" />
            </div>
            {loading ? null : isAuthenticated ? (
              <Button onClick={() => setLocation(hasAccessQuery.data ? "/dashboard" : "/subscribe")} size="sm">
                {hasAccessQuery.data ? tr.dashboard : tr.activateSubscription}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => window.location.href = getLoginUrl()}>
                  {tr.login}
                </Button>
                <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  {tr.startNow}
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
              {tr.heroSubtitle}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight uppercase">
              {tr.heroTitle1}<br />
              <span className="text-primary">{tr.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              {tr.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-base px-8 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all">
                {tr.tryNow}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-base px-8 uppercase tracking-wider border-border/50 hover:border-primary/50">
                {tr.seePrices}
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <Gift className="h-3.5 w-3.5 text-primary" /><span>{tr.badge5sims}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" /><span>{tr.badge7days}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-primary" /><span>{tr.badgeNoCard}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">{tr.featuresTitle}</h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">{tr.featuresDesc}</p>
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
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">{tr.pricingTitle}</h2>
            <p className="text-muted-foreground text-base">{tr.pricingDesc}</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 uppercase tracking-widest text-xs">{tr.planBadge}</Badge>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-foreground">29€</span>
                    <span className="text-muted-foreground">{tr.perMonth}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tr.perSalon}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
                    <Gift className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">{tr.trialBadge}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[tr.pricingItem1, tr.pricingItem2, tr.pricingItem3, tr.pricingItem4, tr.pricingItem5, tr.pricingItem6].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]" size="lg" onClick={handleGetStarted}>
                  {tr.startTrial}<ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">{tr.trialNote}</p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {tr.questions}{" "}
                  <a href="mailto:geral@anjosurbanosvirtual.com" className="text-primary hover:underline">geral@anjosurbanosvirtual.com</a>
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
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">{tr.testimonialsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50 bg-card hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}
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

      {/* Formação */}
      <section id="formacao" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary bg-primary/5 uppercase tracking-widest text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />{tr.formacaoBadge}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">{tr.formacaoTitle}</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">{tr.formacaoDesc}</p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.08)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground font-bold">{tr.formacaoDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{tr.formacaoLocal}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{tr.formacaoDuration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{tr.formacaoSpots}</span>
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <h4 className="font-bold text-foreground uppercase tracking-wide text-xs mb-3">{tr.formacaoProgram}</h4>
                    <ul className="space-y-2">
                      {[tr.prog1, tr.prog2, tr.prog3, tr.prog4, tr.prog5].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <h4 className="font-bold text-foreground uppercase tracking-wide text-xs mb-4 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-primary" />{tr.formacaoPrices}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-foreground">{tr.socios}</p>
                        <p className="text-xs text-muted-foreground">{tr.precoNormal}</p>
                      </div>
                      <span className="text-xl font-black text-foreground">100€</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-foreground">{tr.naoSocios}</p>
                        <p className="text-xs text-muted-foreground">{tr.precoNormal}</p>
                      </div>
                      <span className="text-xl font-black text-foreground">150€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border border-primary/40 bg-card shadow-[0_0_40px_rgba(57,255,20,0.08)] relative overflow-hidden sticky top-24">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 uppercase tracking-widest text-xs">
                      <Users className="h-3 w-3 mr-1" />{tr.vagasLimitadas}
                    </Badge>
                    <h3 className="font-black text-foreground uppercase tracking-wide text-base">{tr.formTitle}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tr.formDesc}</p>
                  </div>
                  <FormacaoForm lang={lang} tr={tr} />
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
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 uppercase tracking-tight">{tr.ctaTitle}</h2>
            <p className="text-muted-foreground text-base mb-8">{tr.ctaDesc}</p>
            <Button size="lg" onClick={handleGetStarted} className="text-base px-10 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]">
              {tr.ctaBtn}<ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">{tr.ctaNote}</p>
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
            © {new Date().getFullYear()} Anjos Urbanos Virtual. {tr.rights}
          </p>
          <a href="mailto:geral@anjosurbanosvirtual.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            geral@anjosurbanosvirtual.com
          </a>
        </div>
      </footer>
    </div>
  );
}

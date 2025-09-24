import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import FinancialOverview from "@/components/FinancialOverview";
import CreditCardGrid from "@/components/CreditCardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  Filter,
  Download,
  Users,
  Target,
  ShoppingCart
} from "lucide-react";
import heroImage from "@/assets/finizo-hero.jpg";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const recentTransactions = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: -127.50,
      date: "2024-01-15",
      category: "Alimentação",
      type: "credit",
      card: "Nubank",
    },
    {
      id: 2,
      description: "Salário Empresa XYZ",
      amount: 4500.00,
      date: "2024-01-14",
      category: "Receita",
      type: "transfer",
    },
    {
      id: 3,
      description: "Netflix",
      amount: -29.90,
      date: "2024-01-13",
      category: "Entretenimento",
      type: "debit",
    },
    {
      id: 4,
      description: "Combustível Posto BR",
      amount: -95.00,
      date: "2024-01-12",
      category: "Transporte",
      type: "credit",
      card: "Itaú",
    },
    {
      id: 5,
      description: "Dividir Pizza - Grupo Amigos",
      amount: -42.30,
      date: "2024-01-11",
      category: "Alimentação",
      type: "shared",
      shared: true,
      group: "Amigos da Faculdade",
    },
  ];

  const upcomingBills = [
    { name: "Nubank", dueDate: "2024-01-22", amount: 2430.50, status: "pending" },
    { name: "Itaú Platinum", dueDate: "2024-01-17", amount: 4200.00, status: "urgent" },
    { name: "Conta de Luz", dueDate: "2024-01-25", amount: 185.90, status: "scheduled" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Finizo Dashboard" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 py-12 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Bem-vindo de volta!
            </h1>
            <p className="text-xl text-white/90 mb-6 animate-slide-up">
              Gerencie suas finanças de forma inteligente e compartilhada
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/reports">
                <Button variant="gradient" size="lg" className="bg-white text-primary hover:bg-white/90">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Ver Relatórios
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Configurações
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinancialOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                      <span>Transações Recentes</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                            transaction.amount > 0 ? 'bg-success-soft text-success' : 
                            transaction.shared ? 'bg-accent-purple-light text-accent-purple' :
                            'bg-destructive-soft text-destructive'
                          }`}>
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : transaction.shared ? (
                              <Users className="w-5 h-5" />
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-muted-foreground">{transaction.category}</p>
                              {transaction.shared && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.group}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.card || new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bills */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Próximos Vencimentos</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBills.map((bill, index) => (
                      <div key={bill.name} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                            bill.status === 'urgent' ? 'bg-destructive-soft text-destructive' :
                            bill.status === 'scheduled' ? 'bg-success-soft text-success' :
                            'bg-primary-soft text-primary'
                          }`}>
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{bill.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge 
                            variant={bill.status === 'urgent' ? 'destructive' : bill.status === 'scheduled' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {bill.status === 'urgent' ? 'Urgente' : bill.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards">
            <CreditCardGrid />
          </TabsContent>

          <TabsContent value="transactions">
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transações em desenvolvimento</h3>
              <p className="text-muted-foreground">Esta seção estará disponível em breve.</p>
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Grupos em desenvolvimento</h3>
              <p className="text-muted-foreground">Esta seção estará disponível em breve.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
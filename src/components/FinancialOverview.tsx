import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CreditCard, Wallet, Users, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FinancialOverview = () => {
  const stats = [
    {
      title: "Receitas",
      value: "R$ 5.420,00",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "success",
    },
    {
      title: "Despesas",
      value: "R$ 3.280,00",
      change: "-8.2%",
      trend: "down",
      icon: TrendingDown,
      color: "destructive",
    },
    {
      title: "Saldo Atual",
      value: "R$ 2.140,00",
      change: "+15.3%",
      trend: "up",
      icon: Wallet,
      color: "primary",
    },
    {
      title: "Cartões Ativos",
      value: "4",
      change: "2 próximos ao venc.",
      trend: "neutral",
      icon: CreditCard,
      color: "secondary",
    },
  ];

  const sharedExpenses = [
    { name: "Viagem Família", amount: "R$ 1.240,00", members: 4, status: "pending" },
    { name: "Despesas Casa", amount: "R$ 890,00", members: 2, status: "settled" },
    { name: "Churrasco Amigos", amount: "R$ 420,00", members: 6, status: "active" },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${
                  stat.color === 'success' ? 'bg-success-soft text-success' :
                  stat.color === 'destructive' ? 'bg-destructive-soft text-destructive' :
                  stat.color === 'primary' ? 'bg-primary-soft text-primary' :
                  'bg-accent-purple-light text-accent-purple'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center space-x-1 ${
                  stat.trend === 'up' ? 'text-success' :
                  stat.trend === 'down' ? 'text-destructive' :
                  'text-muted-foreground'
                }`}>
                  <span>{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Shared Expenses Section */}
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Despesas Compartilhadas</span>
            </CardTitle>
            <Badge variant="outline" className="bg-primary-soft text-primary border-primary">
              3 Grupos Ativos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sharedExpenses.map((expense, index) => (
              <div key={expense.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{expense.name}</h4>
                    <p className="text-sm text-muted-foreground">{expense.members} membros</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{expense.amount}</p>
                  <Badge 
                    variant={expense.status === 'settled' ? 'default' : expense.status === 'pending' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {expense.status === 'settled' ? 'Quitado' : expense.status === 'pending' ? 'Pendente' : 'Ativo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
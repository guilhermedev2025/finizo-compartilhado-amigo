import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, AlertTriangle, Plus } from "lucide-react";

const CreditCardGrid = () => {
  const creditCards = [
    {
      id: 1,
      name: "Nubank Roxinho",
      lastFourDigits: "1234",
      brand: "Mastercard",
      closingDate: "15",
      dueDate: "22",
      currentSpent: 2430.50,
      limit: 5000,
      status: "normal",
      color: "bg-gradient-purple",
    },
    {
      id: 2,
      name: "Itaú Platinum",
      lastFourDigits: "5678",
      brand: "Visa",
      closingDate: "10",
      dueDate: "17",
      currentSpent: 4200.00,
      limit: 8000,
      status: "warning",
      color: "bg-gradient-primary",
    },
    {
      id: 3,
      name: "XP Investimentos",
      lastFourDigits: "9012",
      brand: "Mastercard",
      closingDate: "28",
      dueDate: "05",
      currentSpent: 890.75,
      limit: 3000,
      status: "normal",
      color: "bg-gradient-success",
    },
  ];

  const getUsagePercentage = (spent: number, limit: number) => {
    return (spent / limit) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning": return "text-destructive";
      case "normal": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meus Cartões</h2>
          <p className="text-muted-foreground">Gerencie seus cartões de crédito</p>
        </div>
        <Button className="bg-gradient-primary shadow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cartão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditCards.map((card, index) => {
          const usagePercentage = getUsagePercentage(card.currentSpent, card.limit);
          
          return (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in group" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0">
                {/* Card Visual */}
                <div className={`${card.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8" />
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {card.brand}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{card.name}</h3>
                      <p className="text-white/80">•••• •••• •••• {card.lastFourDigits}</p>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fechamento: {card.closingDate}</span>
                    </div>
                    <span className="font-medium">Venc: {card.dueDate}</span>
                  </div>

                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gasto atual</span>
                      <div className="flex items-center space-x-2">
                        {card.status === "warning" && (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        )}
                        <span className={getStatusColor(card.status)}>
                          {usagePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          usagePercentage > 80 ? 'bg-destructive' : 
                          usagePercentage > 60 ? 'bg-yellow-500' : 
                          'bg-success'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        R$ {card.currentSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-muted-foreground">
                        / R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CreditCardGrid;
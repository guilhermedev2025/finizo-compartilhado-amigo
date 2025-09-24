import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import NewTransactionForm from "@/components/NewTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus,
  Users,
  ShoppingCart,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          credit_cards(name, last_four_digits),
          groups(name)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || transaction.payment_type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (transaction: any) => {
    if (transaction.amount > 0) return <ArrowUpRight className="w-5 h-5" />;
    if (transaction.is_shared) return <Users className="w-5 h-5" />;
    return <ShoppingCart className="w-5 h-5" />;
  };

  const getTransactionColor = (transaction: any) => {
    if (transaction.amount > 0) return 'bg-success-soft text-success';
    if (transaction.is_shared) return 'bg-accent-purple-light text-accent-purple';
    return 'bg-destructive-soft text-destructive';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Transações</h1>
            <p className="text-muted-foreground">Gerencie todas as suas transações</p>
          </div>
          
          <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-primary hover:shadow-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">+R$ 4.500,00</p>
                  <p className="text-xs text-muted-foreground">Receitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">-R$ 2.294,70</p>
                  <p className="text-xs text-muted-foreground">Despesas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-accent-purple" />
                <div>
                  <p className="text-2xl font-bold text-accent-purple">-R$ 42,30</p>
                  <p className="text-xs text-muted-foreground">Compartilhadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-primary">+R$ 2.205,30</p>
                  <p className="text-xs text-muted-foreground">Saldo Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Histórico de Transações</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="credit">Crédito</SelectItem>
                    <SelectItem value="debit">Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions && filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
                <p className="text-muted-foreground mb-6">Adicione sua primeira transação para começar.</p>
                <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Primeira Transação
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions?.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getTransactionColor(transaction)}`}>
                        {getTransactionIcon(transaction)}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {transaction.payment_type}
                          </Badge>
                          {transaction.credit_cards && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.credit_cards.name}
                            </Badge>
                          )}
                          {transaction.is_shared && transaction.groups && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.groups.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                        {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewTransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default Transactions;
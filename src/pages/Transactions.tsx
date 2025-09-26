import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import NewTransactionForm from "@/components/NewTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus,
  Users,
  ShoppingCart,
  Calendar,
  Loader2,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          credit_cards!credit_card_id(name, last_four_digits),
          groups!group_id(name)
        `)
        .order('transaction_date', { ascending: false })
        .limit(100); // Limit for better performance
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  // Memoized filtered transactions for better performance
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || transaction.payment_type === filter;
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [transactions, searchTerm, filter, categoryFilter]);

  // Transaction statistics with memoization
  const transactionStats = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, shared: 0, total: 0 };
    
    return transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      
      if (transaction.is_shared) {
        acc.shared += Math.abs(amount);
      } else if (amount > 0) {
        acc.income += amount;
      } else {
        acc.expenses += Math.abs(amount);
      }
      
      acc.total = acc.income - acc.expenses - acc.shared;
      return acc;
    }, { income: 0, expenses: 0, shared: 0, total: 0 });
  }, [transactions]);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const categories = [
    "Alimentação",
    "Transporte", 
    "Saúde",
    "Educação",
    "Entretenimento",
    "Compras",
    "Casa",
    "Outros"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Transações</h1>
            <p className="text-muted-foreground">Gerencie todas as suas transações</p>
          </div>
          
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-primary hover:shadow-primary animate-scale-in"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(transactionStats.income)}
                  </p>
                  <p className="text-xs text-muted-foreground">Receitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">
                    -{formatCurrency(transactionStats.expenses)}
                  </p>
                  <p className="text-xs text-muted-foreground">Despesas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-accent-purple" />
                <div>
                  <p className="text-2xl font-bold text-accent-purple">
                    -{formatCurrency(transactionStats.shared)}
                  </p>
                  <p className="text-xs text-muted-foreground">Compartilhadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className={`text-2xl font-bold ${transactionStats.total >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(transactionStats.total)}
                  </p>
                  <p className="text-xs text-muted-foreground">Saldo Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Histórico de Transações</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="credit">Crédito</SelectItem>
                    <SelectItem value="debit">Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm || filter !== "all" || categoryFilter !== "all"
                    ? "Nenhuma transação encontrada"
                    : "Nenhuma transação encontrada"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filter !== "all" || categoryFilter !== "all"
                    ? "Tente ajustar os filtros para ver mais resultados."
                    : "Adicione sua primeira transação para começar."}
                </p>
                {!searchTerm && filter === "all" && categoryFilter === "all" && (
                  <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Primeira Transação
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-all duration-300 hover-scale animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getTransactionColor(transaction)}`}>
                        {getTransactionIcon(transaction)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{transaction.description}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {transaction.payment_type === 'credit' && 'Crédito'}
                            {transaction.payment_type === 'debit' && 'Débito'}
                            {transaction.payment_type === 'pix' && 'PIX'}
                            {transaction.payment_type === 'cash' && 'Dinheiro'}
                            {transaction.payment_type === 'transfer' && 'Transferência'}
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
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                          {transaction.amount > 0 ? '+' : ''}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }}
      />
    </div>
  );
};

export default Transactions;
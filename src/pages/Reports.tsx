import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Target,
  Filter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const Reports = () => {
  const [period, setPeriod] = useState("month");
  const [category, setCategory] = useState("all");

  // Mock data for charts - would come from database in real app
  const monthlyData = [
    { name: 'Jan', receitas: 4000, despesas: 2400 },
    { name: 'Fev', receitas: 3000, despesas: 1398 },
    { name: 'Mar', receitas: 2000, despesas: 9800 },
    { name: 'Abr', receitas: 2780, despesas: 3908 },
    { name: 'Mai', receitas: 1890, despesas: 4800 },
    { name: 'Jun', receitas: 2390, despesas: 3800 },
  ];

  const categoryData = [
    { name: 'Alimentação', value: 30, color: '#8884d8' },
    { name: 'Transporte', value: 25, color: '#82ca9d' },
    { name: 'Entretenimento', value: 20, color: '#ffc658' },
    { name: 'Saúde', value: 15, color: '#ff7c7c' },
    { name: 'Outros', value: 10, color: '#8dd1e1' },
  ];

  const topExpenses = [
    { description: "Supermercado Extra", amount: 450.00, category: "Alimentação", date: "2024-01-15" },
    { description: "Posto Shell", amount: 280.50, category: "Transporte", date: "2024-01-14" },
    { description: "Netflix + Spotify", amount: 59.80, category: "Entretenimento", date: "2024-01-13" },
    { description: "Farmácia", amount: 125.30, category: "Saúde", date: "2024-01-12" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios</h1>
            <p className="text-muted-foreground">Análise detalhada das suas finanças</p>
          </div>
          
          <div className="flex space-x-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">+R$ 12.450</p>
                  <p className="text-xs text-muted-foreground">Receitas Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">-R$ 8.236</p>
                  <p className="text-xs text-muted-foreground">Despesas Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-primary">+R$ 4.214</p>
                  <p className="text-xs text-muted-foreground">Saldo Líquido</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="w-8 h-8 text-accent-purple" />
                <div>
                  <p className="text-2xl font-bold text-accent-purple">66%</p>
                  <p className="text-xs text-muted-foreground">Meta Atingida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Tendência Mensal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
                      <Line type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Distribuição por Categoria</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <RechartsPieChart
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Maiores Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{expense.description}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {expense.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-destructive">
                        -R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Análise por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Relatório por Categoria</h3>
                  <p className="text-muted-foreground">Análise detalhada das despesas por categoria em desenvolvimento.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Cartões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Análise por Cartão</h3>
                  <p className="text-muted-foreground">Relatório de gastos por cartão de crédito em desenvolvimento.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Grupos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Despesas Compartilhadas</h3>
                  <p className="text-muted-foreground">Análise de despesas compartilhadas por grupo em desenvolvimento.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
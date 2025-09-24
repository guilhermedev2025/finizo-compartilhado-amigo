import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Cards = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: cards, isLoading, refetch } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddCard = async (formData: FormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('credit_cards')
      .insert({
        user_id: user.id,
        name: formData.get('name') as string,
        last_four_digits: formData.get('lastFour') as string,
        closing_date: parseInt(formData.get('closingDate') as string),
        due_date: parseInt(formData.get('dueDate') as string),
        credit_limit: parseFloat(formData.get('creditLimit') as string),
        brand: formData.get('brand') as string,
        color: formData.get('color') as string,
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cartão.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Cartão adicionado com sucesso!",
      });
      setIsAddDialogOpen(false);
      refetch();
    }
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Meus Cartões</h1>
            <p className="text-muted-foreground">Gerencie seus cartões de crédito</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cartão
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cartão</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleAddCard(new FormData(e.currentTarget)); }} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Cartão</Label>
                  <Input id="name" name="name" placeholder="Ex: Nubank Ultravioleta" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastFour">Últimos 4 dígitos</Label>
                    <Input id="lastFour" name="lastFour" placeholder="1234" maxLength={4} required />
                  </div>
                  <div>
                    <Label htmlFor="brand">Bandeira</Label>
                    <Select name="brand" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="elo">Elo</SelectItem>
                        <SelectItem value="american-express">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="closingDate">Dia de Fechamento</Label>
                    <Input id="closingDate" name="closingDate" type="number" min="1" max="31" required />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Dia de Vencimento</Label>
                    <Input id="dueDate" name="dueDate" type="number" min="1" max="31" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="creditLimit">Limite de Crédito</Label>
                  <Input id="creditLimit" name="creditLimit" type="number" step="0.01" placeholder="5000.00" />
                </div>
                <div>
                  <Label htmlFor="color">Cor do Cartão</Label>
                  <Input id="color" name="color" type="color" defaultValue="#007BFF" />
                </div>
                <Button type="submit" className="w-full">
                  Adicionar Cartão
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {cards && cards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-muted-foreground mb-6">Adicione seu primeiro cartão de crédito para começar.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cartão
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards?.map((card) => (
              <Card key={card.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}80)` }}
                />
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">**** {card.last_four_digits}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {card.brand}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fechamento</p>
                        <p className="text-sm font-medium">Dia {card.closing_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Vencimento</p>
                        <p className="text-sm font-medium">Dia {card.due_date}</p>
                      </div>
                    </div>
                  </div>
                  
                  {card.credit_limit && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Limite Disponível</p>
                        <p className="text-sm font-medium">
                          R$ {((card.credit_limit || 0) - (card.current_balance || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
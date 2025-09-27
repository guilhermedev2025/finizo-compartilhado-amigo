import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NewTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  "Alimentação",
  "Transporte", 
  "Entretenimento",
  "Saúde",
  "Educação",
  "Casa",
  "Roupas",
  "Tecnologia",
  "Outros"
];

const NewTransactionForm = ({ isOpen, onClose, onSuccess }: NewTransactionFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [paymentType, setPaymentType] = useState<string>("");
  const { toast } = useToast();

  const { data: creditCards } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });


  const handleSubmit = async (formData: FormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const amount = parseFloat(formData.get('amount') as string);
    const isExpense = (formData.get('type') as string) === 'expense';
    
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        description: formData.get('description') as string,
        amount: isExpense ? -Math.abs(amount) : Math.abs(amount),
        transaction_date: format(date, 'yyyy-MM-dd'),
        payment_type: formData.get('paymentType') as string,
        credit_card_id: paymentType === 'credit' ? (formData.get('creditCard') as string) : null,
        category: formData.get('category') as string,
        responsible_person: formData.get('responsiblePerson') as string || null,
        notes: formData.get('notes') as string || null,
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!",
      });
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" placeholder="Ex: Supermercado Extra" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                placeholder="0,00" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Forma de Pagamento</Label>
              <Select name="paymentType" value={paymentType} onValueChange={setPaymentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {paymentType === 'credit' && (
              <div className="space-y-2">
                <Label htmlFor="creditCard">Cartão de Crédito</Label>
                <Select name="creditCard" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cartão" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditCards?.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} (*{card.last_four_digits})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data da Transação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsiblePerson">Pessoa Responsável (opcional)</Label>
            <Input 
              id="responsiblePerson" 
              name="responsiblePerson" 
              placeholder="Ex: João Silva" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Adicione observações sobre esta transação..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Salvar Transação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionForm;
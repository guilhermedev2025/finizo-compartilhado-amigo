import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Settings, 
  UserPlus,
  DollarSign,
  Calendar,
  Crown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: groups, isLoading, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          user_groups!inner(
            role,
            profiles(display_name)
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateGroup = async (formData: FormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        owner_id: user.id,
      })
      .select()
      .single();

    if (groupError) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o grupo.",
        variant: "destructive",
      });
      return;
    }

    // Add the creator as owner to user_groups
    const { error: memberError } = await supabase
      .from('user_groups')
      .insert({
        user_id: user.id,
        group_id: group.id,
        role: 'owner',
      });

    if (memberError) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar usuário ao grupo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });
      setIsCreateDialogOpen(false);
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Meus Grupos</h1>
            <p className="text-muted-foreground">Gerencie despesas compartilhadas com amigos e família</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo</DialogTitle>
              </DialogHeader>
              <form action={handleCreateGroup} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input id="name" name="name" placeholder="Ex: Viagem para a Praia" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva o propósito do grupo..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Criar Grupo
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {groups && groups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum grupo criado</h3>
            <p className="text-muted-foreground mb-6">Crie seu primeiro grupo para compartilhar despesas.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Grupo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups?.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{group.name}</span>
                        <Crown className="w-4 h-4 text-yellow-500" />
                      </CardTitle>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {group.user_groups?.length || 0} membro(s)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Saldo: R$ 0,00</p>
                      <p className="text-xs text-muted-foreground">Nenhuma transação</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex -space-x-2">
                      {group.user_groups?.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {member.profiles?.display_name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {(group.user_groups?.length || 0) > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{(group.user_groups?.length || 0) - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <UserPlus className="w-4 h-4" />
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

export default Groups;
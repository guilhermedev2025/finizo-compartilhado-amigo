import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Crown,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          user_groups(
            role,
            user_id
          )
        `);
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // 30 seconds
  });

  // Memoize group statistics for better performance
  const groupsWithStats = useMemo(() => {
    if (!groups) return [];
    
    return groups.map(group => {
      const memberCount = group.user_groups?.length || 0;
      const isOwner = group.user_groups?.some(ug => 
        ug.user_id === group.owner_id && ug.role === 'owner'
      );
      
      return {
        ...group,
        memberCount,
        isOwner
      };
    });
  }, [groups]);

  const createGroupMutation = useMutation({
    mutationFn: async (formData: { name: string; description: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          owner_id: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add the creator as owner to user_groups
      const { error: memberError } = await supabase
        .from('user_groups')
        .insert({
          user_id: user.id,
          group_id: group.id,
          role: 'owner',
        });

      if (memberError) throw memberError;
      
      return group;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o grupo.",
        variant: "destructive",
      });
    }
  });

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createGroupMutation.mutate({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    });
  };

  const handleInviteUser = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsInviteDialogOpen(true);
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Meus Grupos</h1>
            <p className="text-muted-foreground">Gerencie despesas compartilhadas com amigos e família</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-primary animate-scale-in">
                <Plus className="w-4 h-4 mr-2" />
                Criar Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ex: Viagem para a Praia" 
                    required 
                    disabled={createGroupMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva o propósito do grupo..."
                    rows={3}
                    disabled={createGroupMutation.isPending}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createGroupMutation.isPending}
                >
                  {createGroupMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar Grupo
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {groupsWithStats.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
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
            {groupsWithStats.map((group, index) => (
              <Card 
                key={group.id} 
                className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span className="truncate">{group.name}</span>
                        {group.isOwner && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                      </CardTitle>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {group.memberCount} membro(s)
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
                      {group.user_groups?.slice(0, 3).map((member, memberIndex) => (
                        <Avatar key={memberIndex} className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            U
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.memberCount > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{group.memberCount - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleInviteUser(group.id)}
                      className="hover:bg-primary/10"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Invite User Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Convidar Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email do usuário</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="usuario@exemplo.com" 
                  required 
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsInviteDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Enviar Convite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Groups;
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Logout realizado with sucesso!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground">Personalize sua experiência no Finizo</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm">
                    Email
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-sm">
                    Push
                  </Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bill-reminders" className="text-sm">
                    Lembretes de Contas
                  </Label>
                  <Switch id="bill-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="group-updates" className="text-sm">
                    Atualizações de Grupo
                  </Label>
                  <Switch id="group-updates" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacidade & Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor" className="text-sm">
                    Autenticação 2FA
                  </Label>
                  <Badge variant="outline">Em breve</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric" className="text-sm">
                    Login Biométrico
                  </Label>
                  <Badge variant="outline">Em breve</Badge>
                </div>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Alterar Senha
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Dados
                </Button>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Aparência</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-sm">
                    Modo Escuro
                  </Label>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-view" className="text-sm">
                    Visualização Compacta
                  </Label>
                  <Switch id="compact-view" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Tema de Cores</Label>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary border-2 border-background ring-2 ring-primary cursor-pointer"></div>
                    <div className="w-6 h-6 rounded-full bg-accent-purple border-2 border-background cursor-pointer"></div>
                    <div className="w-6 h-6 rounded-full bg-success border-2 border-background cursor-pointer"></div>
                    <div className="w-6 h-6 rounded-full bg-destructive border-2 border-background cursor-pointer"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data & Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Dados & Armazenamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uso de Armazenamento</span>
                    <Badge variant="secondary">2.3 MB</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Limpar Cache
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Suporte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Central de Ajuda
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Reportar Bug
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Sugerir Funcionalidade
                </Button>
                <Separator />
                <div className="text-center text-xs text-muted-foreground">
                  <p>Finizo v1.0.0</p>
                  <p>© 2024 Finizo. Todos os direitos reservados.</p>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  <span>Zona de Perigo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
                <p className="text-xs text-muted-foreground">
                  Atenção: Essas ações são irreversíveis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
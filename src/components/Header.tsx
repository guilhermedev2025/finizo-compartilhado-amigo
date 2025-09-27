import { CreditCard, Plus, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Dropdown imports removed - not needed for current implementation
import NewTransactionForm from "@/components/NewTransactionForm";

const Header = () => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/cards", label: "Cartões" },
    { path: "/transactions", label: "Transações" },
  ];

  return (
    <header className="bg-gradient-hero text-white shadow-purple sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Finizo</h1>
              <p className="text-white/80 text-sm hidden sm:block">Seu gerenciador financeiro</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:bg-white/20 ${
                    location.pathname === item.path ? 'bg-white/20' : ''
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
              onClick={() => setIsTransactionFormOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 relative"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 bg-destructive text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>

            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/20"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <NewTransactionForm 
        isOpen={isTransactionFormOpen} 
        onClose={() => setIsTransactionFormOpen(false)}
        onSuccess={() => setIsTransactionFormOpen(false)}
      />
    </header>
  );
};

export default Header;
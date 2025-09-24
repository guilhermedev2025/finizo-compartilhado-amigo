import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center text-white">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-6 text-xl">Ops! Página não encontrada</p>
        <p className="mb-8 text-white/80">A página que você está procurando não existe no Finizo.</p>
        <Button 
          variant="gradient" 
          size="lg" 
          className="bg-white text-primary hover:bg-white/90"
          onClick={() => window.location.href = "/"}
        >
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

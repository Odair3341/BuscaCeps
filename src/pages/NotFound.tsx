import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { MdError } from "react-icons/md";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <MdError className="text-6xl text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-xl text-gray-600 mb-8">
          A página que você está procurando não existe.
        </p>
        <Button asChild size="lg">
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
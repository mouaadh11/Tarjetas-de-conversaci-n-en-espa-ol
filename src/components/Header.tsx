import { useIsMobile } from "@/hooks/use-mobile";
import { FilePlus2, House, LogOut } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
const Header: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <header className="py-6">
      <div className="container">
        <div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cardBlue-700 to-cardBlue-500 text-transparent bg-clip-text">
              Tarjetas de conversación en español
            </h1>
            <p className="text-center text-gray-600 mt-2 max-w-md mx-auto">
              Practica tu español con estas propuestas de conversación. Revela
              las cartas individualmente o elige una al azar para inspirarte.
            </p>
          </div>
          <Button className="absolute top-12 right-5" asChild>
            <Link to={"/"}>
              <LogOut />
            </Link>
          </Button>
        </div>

        <nav className="flex justify-center mt-6 space-x-4">
          <Link
            to="/home"
            className="flex flex-row gap-2 items-center px-4 py-2 text-gray-600 hover:text-cardBlue-700 font-bold text-xl"
          >
            <House />
            {!isMobile && "pagina principal"}
          </Link>
          <Link
            to="/add"
            className="flex flex-row gap-2 px-4 py-2 text-gray-600 hover:text-cardBlue-700 font-bold text-xl"
          >
            <FilePlus2 />
            {!isMobile && "agregar tarjeta"}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

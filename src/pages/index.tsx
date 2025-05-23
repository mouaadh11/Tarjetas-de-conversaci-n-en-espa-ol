import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Languages, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="text-center py-20 bg-yellow-50">
        <h1 className="text-5xl font-bold text-yellow-600">
          Tarjetas de conversación en español
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Practica tu español con tarjetas simples y divertidas. Ideal para
          principiantes (nivel A1).
        </p>
        <div className="mt-6 space-x-4">
          <Button asChild>
            <Link to="/signup">
              <UserPlus className="mr-2 h-4 w-4" /> Empieza ahora
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Inicio sesion</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Características principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Temas variados</h3>
              <p>Tarjetas sobre música, hobbies, comida y más.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Languages className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Multilingüe</h3>
              <p>Incluye traducciones al inglés y ruso.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Modo aleatorio</h3>
              <p>Genera una tarjeta al azar para practicar.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Gratis y accesible</h3>
              <p>Úsalo desde cualquier dispositivo, sin coste.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl mb-2">📂</p>
              <h3 className="text-xl font-semibold mb-2">Explora tarjetas</h3>
              <p>Filtra tarjetas por categoría o tema.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl mb-2">🎯</p>
              <h3 className="text-xl font-semibold mb-2">Elige una</h3>
              <p>Haz clic en una tarjeta o genera una al azar.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl mb-2">🗣️</p>
              <h3 className="text-xl font-semibold mb-2">Practica</h3>
              <p>Úsala para conversar con amigos o compañeros.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-100 text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          ¿Listo para mejorar tu español?
        </h2>
        <p className="text-lg mb-6">
          Crea tu cuenta hoy, ¡es totalmente gratis!
        </p>
        <Button size="lg" asChild>
          <Link to="/signup">Crear cuenta</Link>
        </Button>
      </section>
    </div>
  );
}

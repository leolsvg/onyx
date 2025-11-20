import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import type { Metadata } from "next"; // <--- C'est cette ligne qui manquait
import "./globals.css";

// Configuration du titre et du référencement
export const metadata: Metadata = {
  title: "Onyx | Wealth Management",
  description: "Gérez votre patrimoine avec précision et sérénité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className="bg-[#0B0E14] text-white">
          {/* Si l'utilisateur n'est pas connecté, on affiche le Login au centre */}
          <SignedOut>
            <div className="flex h-screen items-center justify-center">
              <SignIn routing="hash" />
            </div>
          </SignedOut>

          {/* Si connecté, on affiche l'app */}
          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

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
          {/* On rend simplement les enfants. 
              C'est app/page.tsx qui décidera d'afficher la Landing Page ou le Dashboard. */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

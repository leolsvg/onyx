import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// On définit les routes protégées (tout sauf la racine)
// Si tu veux que la racine "/" soit publique, ne la mets pas dans protect()
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // Exemple : protège tout ce qui commence par /dashboard (si tu avais cette route)
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

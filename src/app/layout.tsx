import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Analytics } from "@vercel/analytics/react";
import OfflineIndicator from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { APP_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUIZVERSE | Jogo de Quiz em Família",
  description: "Joga juntos no ecrã grande! A experiência de quiz em família definitiva. Desafia os teus amigos num jogo de perguntas épico!",
  keywords: ["quiz", "jogo", "família", "trivia", "online", "multiplayer", "perguntas"],
  authors: [{ name: "QuizVerse" }],
  openGraph: {
    title: "QUIZVERSE | Jogo de Quiz em Família",
    description: "A experiência de quiz em família definitiva! Joga no ecrã grande com os teus amigos.",
    url: APP_URL,
    siteName: "QuizVerse",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUIZVERSE | Jogo de Quiz em Família",
    description: "A experiência de quiz em família definitiva! Joga no ecrã grande com os teus amigos.",
  },
  themeColor: "#121223",
  appleWebApp: {
    capable: true,
    title: "QuizVerse",
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#d0bcff] focus:text-[#121223] focus:rounded-xl focus:font-bold">
          Saltar para o conteúdo principal
        </a>
        <ErrorBoundary>
          <GameProvider>
            <div id="main-content">
              {children}
            </div>
          </GameProvider>
        </ErrorBoundary>
        <Analytics />
        <OfflineIndicator />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
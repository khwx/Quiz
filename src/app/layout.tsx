import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Analytics } from "@vercel/analytics/react";

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
    url: "https://quiz-two-zeta-67.vercel.app",
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
        <GameProvider>
          {children}
        </GameProvider>
        <Analytics />
      </body>
    </html>
  );
}
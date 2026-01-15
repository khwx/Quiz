import { Analytics } from "@vercel/analytics/react";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-inter antialiased`}
      >
        <GameProvider>
          {children}
        </GameProvider>
        <script src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" defer></script>
        <Analytics />
      </body>
    </html>
  );
}

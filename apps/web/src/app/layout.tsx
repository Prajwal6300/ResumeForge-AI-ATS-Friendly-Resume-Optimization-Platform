import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "ResumeForge AI — ATS-Friendly Resume Optimization Platform",
  description:
    "AI-Powered ATS Resume Optimization & Job Matching Platform. Real deterministic ATS scoring, keyword gap analysis, and factual AI tailoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-background font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

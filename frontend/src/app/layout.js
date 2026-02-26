import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import AppBar from "../components/AppBar";
import AuthGate from "../components/AuthGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Expense Tracker — Dashboard",
  description: "Professional expense analytics dashboard for personal finance management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        <ThemeProvider>
          <AuthGate>
            <AppBar />
            <main>{children}</main>
          </AuthGate>
        </ThemeProvider>
      </body>
    </html>
  );
}

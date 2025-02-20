import { Geist, Geist_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa";
import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"], // поддержка кириллицы
  weight: ["300", "400", "500", "600", "700"], // нужные толщины
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Форма подачи данных для страхового полиса",
  description:
    "Заполните форму, чтобы передать необходимые данные страхователю для оформления страхового полиса.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="w-full bg-gray-100 border-b border-gray-300 py-4 px-6 justify-end items-center fixed hidden md:flex z-10">
          <div className="flex flex-col">
            <p className="text-gray-700 text-sm mb-1">
              Если у вас возникли вопросы, свяжитесь с нами:
            </p>
            <div className="flex items-center justify-end space-x-3">
              <FaWhatsapp className="text-green-600 w-4 h-4" />
              <p className="text-black hover:text-gray-700">
                +7 (953) 351-08-50
              </p>
            </div>
          </div>
        </header>
        <main className="flex-grow flex flex-col pt-20">{children}</main>
      </body>
    </html>
  );
}

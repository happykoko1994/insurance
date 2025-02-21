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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ренессанс страхование Московская Славянка",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Московская Славянка, 17А, ТЦ, этаж 2, павильон 35",
      "addressLocality": "Санкт-Петербург",
      "postalCode": "196645",
      "addressCountry": "RU"
    },
    "telephone": "+7 (921) 432-95-42",
    "openingHours": "Mo-Fr 10:00-19:00, Sa-Su 10:00-18:00",
    "url": "https://insurance-basova.vercel.app/"
  };
  return (
    <html lang="ru">
      <head>
      <meta name="keywords" content="страхование Московская Славянка, ОСАГО Колпино, КАСКО Пушкин, страховой агент Санкт-Петербург, Ренессанс страхование, автостраховка онлайн, страховка оффлайн"/>
      <meta name="description" content="Заполните форму, чтобы передать необходимые данные страхователю для оформления страхового полиса." />
      <title>Страхование автомобилей в Московской Славянке</title>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
                +7(921) 432-95-42
              </p>
            </div>
          </div>
        </header>
        <main className="flex-grow flex flex-col">{children}</main>
      </body>
    </html>
  );
}

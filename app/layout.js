import { Geist, Geist_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa";
import Script from "next/script"; // Импортируем next/script
import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
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

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ренессанс страхование Московская Славянка",
    "image": "https://insurance-basova.vercel.app/favicon.ico",
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
        <meta name="keywords" content="страхование Московская Славянка, ОСАГО Колпино, страхование авто Колпино, ОСАГО в Пушкине, автостраховка Пушкин, Ренессанс страхование Санкт-Петербург, страховой агент Ренессанс, Автостраховка онлайн, купить ОСАГО онлайн, автострахование с визитом в офис, ОСАГО без визита в офис, оформить страховку онлайн, продление ОСАГО, Купить ОСАГО онлайн, Купить полис ОСАГО, страховой полис в Пушкине"/>
        <meta name="description" content="Заполните форму, чтобы передать необходимые данные страхователю для оформления страхового полиса." />
        <meta property="og:image" content="https://insurance-basova.vercel.app/favicon.ico"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>Страхование автомобилей в Московской Славянке</title>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Яндекс.Метрика */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(100031652, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true
              });
            `,
          }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Носкрипт для Метрики */}
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/100031652" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        <header className="w-full bg-[rgb(86,0,82)] border-b border-gray-300 py-4 px-6 justify-end items-center fixed hidden md:flex z-10">
          <div className="flex flex-col">
            <p className="text-white text-sm mb-1">
              Если у вас возникли вопросы, свяжитесь с нами:
            </p>
            <div className="flex items-center justify-end space-x-2">
              <FaWhatsapp className="text-green-600 w-4 h-4" />
              <p className="text-white">
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

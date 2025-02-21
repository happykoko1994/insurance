import "../styles/info.css";

export default function StoreInfo() {
  const mapLink =
    "https://yandex.kz/maps/26081/kolpino/?ll=30.497481%2C59.747399&mode=routes&rtext=~59.747481%2C30.497476&rtt=taxi&ruri=~&z=16.86";

  const advantages = [
    "ОСАГО только для легковых автомобилей",
    "Оформление онлайн или оффлайн",
    "Индивидуальный подход и консультация",
  ];
  return (
    <div className="store-info">
      <h1 className="store-info__title">
        Страхование автомобилей в Московской Славянке
      </h1>

      <div className="store-info__section">
        <p className="store-info__text left">
          Опытный специалист с более чем <b className="text-[rgb(160,160,60)]">15 летним стажем</b> поможет вам оформить
          надежную страховку для вашего авто.
        </p>
      </div>

      <div className="store-info__advantages">
        <div className="store-info__advantages-list">
          {advantages.map((text, index) => (
            <div key={index} className="store-info__advantages-item">
              <img src="/mark.svg" alt="✔" className="store-info__icon" />
              <p className="store-info__advantage-text">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="store-info__section">
        <p className="store-info__text">
        💬 Оставьте заявку онлайн или приходите лично – подберем оптимальный вариант!
        </p>
      </div>

      <div className="store-info__contact-map">
        <div className="store-info__contact-left">
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">График работы</h3>
            <p className="store-info__text">
              <span className="workdays">По будням</span>
              <span className="worktime">10:00 - 19:00</span>

              <span className="separator"></span>

              <span className="weekends">Выходные и праздники</span>
              <span className="worktime">10:00 - 18:00</span>
            </p>
          </div>
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">Контакты</h3>
            <p className="store-info__text">
              Для получения дополнительной информации звоните по телефону:
              <br />
              <span className="store-info__bold">+7 (921) 432-95-42</span>
              <br />
              <span className="store-info__bold">+7 (812) 244-28-73</span>
            </p>
          </div>
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">Наш адрес</h3>
            <p className="store-info__text">
              Санкт-Петербург, Московская Славянка, 17А, Торговый центр, этаж 2,
              павильон №35
            </p>
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block bg-[rgb(115,0,109)] hover:bg-[rgb(140,0,133)] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Построить маршрут
          </a>
        </div>

        <div className="store-info__contact-right">
          <iframe
            src="https://yandex.ru/map-widget/v1//?um=constructor%3Ae871367bfd6d9def88dd03a1aaaa5134842d269bb0f0ac93e47ad963c62ac88b&source=constructorLink"
            width="100%"
            height="100%"
            frameBorder="0"
            title="map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

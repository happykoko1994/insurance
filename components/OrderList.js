import { ClipLoader } from "react-spinners";

export default function OrderList({ orders, deleteOrder, deletingOrderId }) {
  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 text-xl">Заявок пока нет 😞</p>
    );
  }

  // Функция форматирования даты в dd/mm/yy
  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU").split(".").join("/");
  };

  return (
    <ul className="w-full space-y-4">
      {orders.map((order) => {
        const formattedCreatedAt = formatDate(order.createdAt);

        return (
          <li
            key={order._id}
            className="border border-gray-300 rounded-xl p-5 shadow bg-white flex flex-col gap-3 transition hover:shadow-lg hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">
                Регион: {order.region || "Не указан"}
              </p>
              <p className="text-lg text-gray-600">
                Срок: {order.insurancePeriod || "Не указан"}
              </p>
            </div>

            <div className="grid grid-cols-2 text-lg text-gray-700">
              <p className="font-semibold col-span-2">Данные автомобиля:</p>
              <p>Марка: {order.car?.brand || "Не указана"}</p>
              <p>Модель: {order.car?.model || "Не указана"}</p>
              <p>Год выпуска: {order.car?.year || "Не указан"}</p>
              <p>Мощность: {order.car?.power || "Не указана"} л.с.</p>
              <p className="col-span-2">VIN: {order.car?.vin || "Не указан"}</p>
            </div>

            <div>
              <p className="font-semibold text-lg">Водители:</p>
              {order.drivers?.length > 0 ? (
                <ul className="text-lg text-gray-700 grid grid-cols-2 gap-4">
                  {order.drivers.map((driver, index) => (
                    <li key={index} className="border-b border-gray-300 pb-2">
                      <p className="font-medium">
                        {driver.lastName || "Не указано"}{" "}
                        {driver.firstName || ""} {driver.middleName || ""}
                      </p>{" "}
                      <p>Дата рождения: {formatDate(driver.birthDate)}</p>
                      <p>Серия ВУ: {driver.licenseSeries || "Не указана"}</p>
                      <p>Номер ВУ: {driver.licenseNumber || "Не указан"}</p>
                      <p>Стаж с: {formatDate(driver.drivingExperienceDate)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-500">Не указаны</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-2 text-gray-500">
              <p className="text-lg">Дата заявки: {formattedCreatedAt}</p>
              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow active:scale-95 transition-all flex items-center text-lg"
                disabled={deletingOrderId === order._id}
              >
                {deletingOrderId === order._id ? (
                  <ClipLoader color="white" size={22} />
                ) : (
                  "Удалить"
                )}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

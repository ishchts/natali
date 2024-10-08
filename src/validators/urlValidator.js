import * as yup from "yup";
import onChange from "on-change";

// Определение схемы валидации URL с помощью yup
const urlSchema = yup
  .string()
  .url("Некорректный URL")
  .required("URL обязателен");

// Функция для валидации URL (синхронная версия)
export const validateUrl = (url, existingUrls) => {
  try {
    // Валидация URL с использованием схемы
    urlSchema.validateSync(url);

    // Проверка на существование URL в массиве existingUrls
    if (existingUrls.includes(url)) {
      return "URL уже существует";
    }
    return null; // URL валиден и не дублируется
  } catch (error) {
    return error.message; // Возвращаем сообщение об ошибке
  }
};

// Функция для инициализации представления формы
export const initializeFormView = (validateUrl) => {
  // Получение элементов формы
  const form = document.querySelector("#rss-form");
  const input = form.querySelector('input[name="url"]');
  const feedback = form.querySelector(".feedback");
  const feeds = [];

  // Создание отслеживаемого состояния
  const state = {
    url: "",
    error: null,
  };
  const watchedState = onChange(state, (path, value) => {
    if (path === "error") {
      feedback.textContent = value; // Текст сообщения об ошибке
      input.classList.toggle("is-invalid", !!value); // Добавление или удаление класса
    }
    if (path === "url") {
      input.value = value; // Синхронизация значения ввода с состоянием
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    watchedState.error = null; // Сброс ошибки

    // Валидация URL
    const error = validateUrl(watchedState.url, feeds);
    if (error) {
      watchedState.error = error; // Устанавливаем сообщение об ошибке
      return;
    }

    // Если валидация успешна, выполняем запрос на сервер для получения данных
    fetch(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.url)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка запроса");
        }
        return response.json();
      })
      .then((data) => {
        // Сохраняем результат в состояние
        feeds.push({ url: watchedState.url, data });

        // Очищаем поле ввода после успешного запроса и сохранения данных
        watchedState.url = "";
        input.focus();
      })
      .catch((error) => {
        watchedState.error = error.message; // Если валидация неуспешна, устанавливаем сообщение об ошибке
      });
  });

  // Обработчик события ввода
  input.addEventListener("input", (event) => {
    watchedState.error = null; // Очищаем сообщение об ошибке при вводе нового значения
    watchedState.url = event.target.value;
  });
};

// Инициализация представления формы
initializeFormView(validateUrl);

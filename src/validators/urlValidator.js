import * as yup from 'yup';

// Определение схемы валидации URL с помощью yup
const urlSchema = yup.string().url('Некорректный URL').required('URL обязателен');

// Асинхронная функция для валидации URL
export const validateUrl = async (url, existingUrls) => {
  try {
    // Валидация URL с использованием схемы
    await urlSchema.validate(url);
    
    // Проверка на существование URL в массиве existingUrls
    if (existingUrls.includes(url)) {
      throw new Error('URL уже существует');
    }
  } catch (error) {
    // Если произошла ошибка валидации или URL уже существует, выбрасываем ошибку
    throw error;
  }
};

// Функция для инициализации представления формы
export const initializeFormView = (state, validateUrl) => {
  // Получение элементов формы
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = form.querySelector('.feedback');
  const feeds = [];

  // Создание отслеживаемого состояния
  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      feedback.textContent = value; // Текст сообщения об ошибке
      input.classList.toggle('is-invalid', !!value); // Добавление или удаление класса
    }
  });

  // Обработчик события отправки формы
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    watchedState.error = null; // Сброс ошибки

    try {
      await validateUrl(watchedState.url, feeds); // Вызов функции валидации URL
      feeds.push(watchedState.url);
      watchedState.url = ''; // Если валидация успешна, добавляем URL в feeds и очищаем поле ввода
      input.value = '';
      input.focus();
      
      // Отправка ссылок и парсинг
      // Здесь добавьте код для отправки ссылок и парсинга
    } catch (error) {
      watchedState.error = error.message; // Если валидация неуспешна, устанавливаем сообщение об ошибке
    }
  });

  // Обработчик события ввода
  input.addEventListener('input', (event) => {
    watchedState.url = event.target.value;
  });
};

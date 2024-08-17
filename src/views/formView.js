import onChange from 'on-change';

export const initializeFormView = (state, validateUrl) => {
  // Получение элементов формы
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = form.querySelector('.feedback');
  const feeds = [];

  // Создание отслеживаемого состояния
  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      input.classList.remove('is-valid', 'is-invalid'); // Удаляем все классы
      input.classList.add(value ? 'is-invalid' : 'is-valid'); // Добавляем нужный в зависомости от результата валидации
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
    } catch (error) {
      watchedState.error = error.message; // Если валидация неуспешна, устанавливаем сообщение об ошибке
    }
  });

  // Обработчик события ввода
  input.addEventListener('input', (event) => {
    watchedState.url = event.target.value;
  });
};


import onChange from 'on-change';

export const state = onChange({
  url: '',
  error: null,
  isValid: false
});

function validateUrl(url) {
  // Добавляем логику валидации URL
  if (isValidUrl(url)) {
    state.isValid = true; // Успешная валидация
    state.url = url; // Сохраняем валидный URL
  } else {
    state.isValid = false;
    state.error = 'Invalid URL';
  }
}
import * as yup from 'yup';
import { addFeed, getFeeds } from '../state/state.js';
import { initializeFormView } from '../views/formView.js';

// Схема валидации URL с использованием yup
const urlSchema = yup.string().url('Некорректный URL').required('URL обязателен');

// Функция валидации
export const validateUrl = async (url, existingFeeds) => {
  await urlSchema.validate(url);

  if (existingFeeds.some((feed) => feed.url === url)) {
    throw new Error('URL уже существует');
  }

  addFeed(url);
};

// Функция инициализации контроллера
export const initializeController = () => {
  const state = { error: null, feeds: getFeeds() };
  initializeFormView(state, validateUrl);
};

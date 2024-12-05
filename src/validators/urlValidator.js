import * as yup from "yup";
import onChange from "on-change";

const urlSchema = yup.string().url().required();

const validateUrl = async (url, existingUrls) => {
  if (!existingUrls) return "Ошибка: список существующих URL пуст";
  try {
    const rssRegex = /feed\b|\bfeed\.xml$/i; 

    if (!rssRegex.test(url)) {
      return 'Ссылка не является RSS-потоком';
    }

    await urlSchema.validate(url);
    if (existingUrls.includes(url)) {
      return 'URL уже существует';
    }
    return null;
  } catch (error) {
    return error.message;
  }
};

const initializeFormView = () => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = form.querySelector('.feedback');
  const feeds = [];

  const state = { url: '', error: null };
  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      feedback.textContent = value;
      input.classList.toggle('is-invalid', !!value);
    }
    if (path === 'url') {
      input.value = value;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    watchedState.error = null;
    const error = await validateUrl(watchedState.url, feeds);

    if (error) {
      watchedState.error = error;
      return;
    }

    try {
      const response = await fetch(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.url)}`
      );
      if (!response.ok) {
        throw new Error('Ошибка запроса');
      }
      const data = await response.json();
      feeds.push({ url: watchedState.url, data });
      watchedState.url = '';
      input.focus();
      watchedState.error = null;
      input.classList.remove("is-invalid")
    } catch (error) {
      watchedState.error = error.message;
    }
  });

  input.addEventListener('input', (event) => {
    watchedState.error = null;
    watchedState.url = event.target.value;
    input.classList.remove("is-invalid")
  });
};

initializeFormView();

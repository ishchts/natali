import onChange from 'on-change';

export const initializeFormView = (state, validateUrl) => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = form.querySelector('.feedback');
  const feeds = [];

  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      feedback.textContent = value;
      input.classList.toggle('is-invalid', !!value);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.error = null;

    validateUrl(watchedState.url, feeds)
      .then(() => {
        feeds.push(watchedState.url);
        watchedState.url = '';
        input.value = '';
        input.focus();
      })
      .catch((error) => {
        watchedState.error = error.message;
      });
  });

  input.addEventListener('input', (event) => {
    watchedState.url = event.target.value;
  });
};

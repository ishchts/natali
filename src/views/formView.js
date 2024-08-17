import onChange from 'on-change';

const renderError = (inputElement, errorMessage) => {
  inputElement.classList.add('is-invalid');
  const feedback = inputElement.nextElementSibling;
  feedback.textContent = errorMessage;
};

const clearError = (inputElement) => {
  inputElement.classList.remove('is-invalid');
  const feedback = inputElement.nextElementSibling;
  feedback.textContent = '';
};

export const initializeFormView = (state, validateUrl) => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  
  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      if (value) {
        renderError(input, value);
      } else {
        clearError(input);
      }
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    watchedState.error = null;

    try {
      await validateUrl(input.value, state.feeds);
      watchedState.error = null;
      input.value = '';
      input.focus();
    } catch (error) {
      watchedState.error = error.message;
    }
  });

  input.addEventListener('input', () => {
    watchedState.error = null;
  });
};
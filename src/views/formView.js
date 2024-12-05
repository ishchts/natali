import onChange from 'on-change';


export const initializeFormView = (state, validateUrl) => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      if (value) {
        renderError(input, value);
      } else {
        clearError(input);
      }
    }
  });


  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    watchedState.error = null;

    const url = input.value.trim();

    if (isValidUrl(url)) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      feedback.style.display = 'none';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.style.display = 'block';
      watchedState.error = 'Invalid URL';
    }
  });

  input.addEventListener('input', () => {
    input.classList.remove('is-invalid', 'is-valid');
    feedback.style.display = 'none';
    watchedState.error = null;
  });

  const renderError = (inputElement, errorMessage) => {
    inputElement.classList.add('is-invalid');
    feedback.textContent = errorMessage;
    feedback.style.display = 'block';
  };

  const clearError = (inputElement) => {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    feedback.style.display = 'none';
  };
};

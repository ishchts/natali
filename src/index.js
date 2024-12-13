import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import resources from './locales/index.js';
import i18next from 'i18next';
import state from './state/state.js';


document.addEventListener('DOMContentLoaded', () => {
  const { ru } = resources;
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then(() => {
      state(i18nextInstance);
    })
    .catch((error) => {
      console.log(`Failed to initialize app: ${error}`);
    });
  });
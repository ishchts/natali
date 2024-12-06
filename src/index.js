import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import state from './state/state.js';


document.addEventListener('DOMContentLoaded', () => {
  const { ru } = resources;
  const i18nextInstance = i18n.createInstance();
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
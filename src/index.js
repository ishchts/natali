import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import resources from './locales/index.js';
import i18next from 'i18next';
import state from './state/state.js';


async function initApp() {
  const { ru } = resources;
  const i18nextInstance = i18next.createInstance();
  try{
    await i18nextInstance.init({
          lng: 'ru',
          debug: true,
          resources: {
            ru,
          },
        });
      state(i18nextInstance);
      }
  catch (error) {
          console.log(errorMessage);
      };
}

initApp();

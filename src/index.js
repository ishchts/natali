import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { validateUrl } from './validators/urlValidator.js';
import { state } from './state/state.js';



document.addEventListener('DOMContentLoaded', () => {
    initializeFormView(state, validateUrl);
  });
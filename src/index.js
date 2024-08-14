import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { validateUrl } from './validators/urlValidator';
import { state } from './state/state';
import './styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
    initializeFormView(state, validateUrl);
  });
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { validateUrl } from 'src/validators/urlValidator';
import { state } from 'src/state/state';



document.addEventListener('DOMContentLoaded', () => {
    initializeFormView(state, validateUrl);
  });
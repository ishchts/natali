import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import render from '../views/formView.js';
import { uniqueIDGenerator, createProxyUrl } from '../validators/urlValidator.js';
import parserRSS from '../rss-parser.js';

export default (i18nextInstance) => {
  setLocale({
    mixed: {
      default: 'form.errors.enterValidURL',
    },
    string: {
      url: 'form.errors.enterValidURL',
    },
  });

  const fillElemContent = (elements, i18n) => {
    const newElements = { ...elements };
    newElements.modalCloseButton.textContent = i18n.t('modalWindow.close');
    newElements.modalReadButton.textContent = i18n.t('modalWindow.read');
    newElements.headerTitle.textContent = i18n.t('header.title');
    newElements.headerParagraph.textContent = i18n.t('header.paragraph');
    newElements.formInput.placeholder = i18n.t('form.input');
    newElements.formInputLabel.textContent = i18n.t('form.input');
    newElements.formSubmitButton.textContent = i18n.t('form.submit');
  };

  const elements = {
    modalCloseButton: document.querySelector('.modal-footer .btn-secondary'),
    modalReadButton: document.querySelector('.modal-footer .btn-primary'),
    headerTitle: document.querySelector('h1.display-3'),
    headerParagraph: document.querySelector('p.lead'),
    formInput: document.querySelector('#url-input'),
    formInputLabel: document.querySelector('label[for="url-input"]'),
    formSubmitButton: document.querySelector('button[type="submit"]'),
    form: document.querySelector('.rss-form'),
    postsContainer: document.querySelector('.posts'),
    modalWindow: document.querySelector('.modal'),
  };

  fillElemContent(elements, i18nextInstance);

  const createValidationSchema = (existingUrls) => object({
    urlValue: string().url().notOneOf(existingUrls, 'form.errors.rssExists'),
  });

  const state = {
    form: {
      input: {
        urlValue: '',
      },
      submit: {
        active: true,
      },
      error: '',
      request: 'successful',
    },
    urls: [],
    feeds: [],
    posts: [],
    readPost: [],
  };

  const validateInput = (input) => {
    const validationSchema = createValidationSchema(
      state.urls.map((url) => url.link),
    );
    return validationSchema
      .validate(input)
      .then(() => null)
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const watchedState = onChange(state, (path) => {
    console.log(state);
    render(state, path, i18nextInstance);
  });

  const checkForUpdates = () => {
    const requests = state.urls.map((url) => {
      const proxyUrl = createProxyUrl(url.link);
      return axios
        .get(proxyUrl)
        .then((response) => {
          if (
            response.status >= 200 && response.status < 300) {
            try {
              const parsedRSS = parserRSS(response.data.contents);
              const newPosts = parsedRSS.posts
                .filter(
                  (post) => !state.posts.some(
                    (statePost) => statePost.postHref === post.postHref,
                  ),
                )
                .map((post) => ({
                  ...post,
                  id: uniqueIDGenerator.generateID(),
                  urlID: url.id,
                }));

              return newPosts;
            } catch (error) {
              console.error(`Failed to parse RSS for URL ${url.link}:`, error);
              return [];
            }
          } else {
            console.log(
              `Failed to update URL ${url.link}: HTTP code is 404 or status is undefined`,
            );
            return [];
          }
        })
        .catch((error) => {
          console.log(`Failed to update URL ${url.link}:`, error);
          return [];
        });
    });

    Promise.all(requests)
      .then((results) => {
        const newPosts = results.flat();
        watchedState.posts.unshift(...newPosts);
      })
      .catch((error) => {
        console.log('Failed to update URLs:', error);
      })
      .finally(() => {
        setTimeout(checkForUpdates, 5000);
      });
  };

  const handleFormResponse = (response, urlValue) => {
    if (response.data) {
      try {
        const parsedRSS = parserRSS(response.data.contents);
        const urlID = uniqueIDGenerator.generateID();
        state.urls.push({ id: urlID, link: urlValue });
        const posts = parsedRSS.posts.map((post) => ({
          ...post,
          id: uniqueIDGenerator.generateID(),
          urlID,
          state: 'new',
        }));
        watchedState.posts.unshift(...posts);
        watchedState.feeds.unshift({
          id: uniqueIDGenerator.generateID(),
          urlID,
          feedTitle: parsedRSS.feedTitle,
          feedDescription: parsedRSS.feedDescription,
        });
        watchedState.form.request = 'successful';
        state.form.input.urlValue = '';
        state.form.error = '';
        elements.form.reset();

        setTimeout(checkForUpdates, 5000);
      } catch (error) {
        watchedState.form.error = 'errors.invalidRSS';
        watchedState.form.request = 'failed';
        console.error('Failed to parse RSS:', error);
      }
    } else {
      watchedState.form.error = 'errors.invalidRSS';
      watchedState.form.request = 'failed';
    }
  };

  const handleFormError = (error) => {
    if (error.response) {
      watchedState.form.error = 'errors.responseError';
    } else if (error.request) {
      watchedState.form.error = 'errors.requestError';
    } else {
      watchedState.form.error = 'errors.invalidRSS';
    }
    watchedState.form.request = 'failed';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlValue = formData.get('url');

    watchedState.form.request = 'sending';

    validateInput({ urlValue })
      .then(() => axios.get(createProxyUrl(urlValue)))
      .then((response) => handleFormResponse(response, urlValue))
      .catch((error) => {
        console.log('error.message', error.message);
        if (error.message === 'form.errors.enterValidURL') {
          watchedState.form.error = error.message;
          watchedState.form.request = 'failed';
          return;
        }
        if (
          error.message === 'form.errors.rssExists'
          || error.name === 'ValidationError'
        ) {
          watchedState.form.error = error.message;
          watchedState.form.request = 'failed';
        } else {
          handleFormError(error);
        }
      })
      .finally(() => {
        elements.formInput.focus();
      });
  };

  const handlePostClick = (e) => {
    const element = e.target;
    if (element.tagName === 'A' || element.tagName === 'BUTTON') {
      const elementID = element.getAttribute('data-id');
      const readPostID = state.posts.findIndex(
        (post) => post.id.toString() === elementID,
      );
      if (readPostID !== -1) {
        state.posts[readPostID].state = 'read';
        watchedState.readPost = element;
      }
    }
  };

  elements.form.addEventListener('submit', handleFormSubmit);

  elements.postsContainer.addEventListener('click', (e) => {
    handlePostClick(e);
  });

  elements.modalWindow.addEventListener('show.bs.modal', (e) => {
    const postTitleElement = e.relatedTarget.previousElementSibling;
    watchedState.readPost = postTitleElement;
  });
};

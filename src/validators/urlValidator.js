import * as yup from 'yup';

const urlSchema = yup.string().url('Некорректный URL').required('URL обязателен');

export const validateUrl = (url, existingUrls) => {
  return urlSchema.validate(url)
    .then(() => {
      if (existingUrls.includes(url)) {
        return Promise.reject(new Error('URL уже существует'));
      }
      return Promise.resolve();
    });
};


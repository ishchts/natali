import * as yup from 'yup';

const urlSchema = yup.string().url('Некорректный URL').required('URL обязателен');

export const validateUrl = (url, existingUrls) => {
  return urlSchema.validate(url)
    .then(() => {
      if (existingUrls.includes(url)) {
        throw new Error('URL уже существует');
      }
    });
};

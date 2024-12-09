const getTextFromHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent.trim();
};

const createProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

class UniqueIDGenerator {
  constructor() {
    this.currentID = 0;
  }

  generateID() {
    this.currentID += 1;
    return this.currentID;
  }
}

const uniqueIDGenerator = new UniqueIDGenerator();

export { uniqueIDGenerator, getTextFromHtml, createProxyUrl };
const getTextFromHtml = (html) => {
  const tempElement = document.createElement('div');
  const textNode = document.createTextNode(html);
  tempElement.appendChild(textNode);
  return tempElement.textContent.trim() || '';
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

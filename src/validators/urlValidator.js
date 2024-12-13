const getTextFromHtml = (html) => {
  const regex = /<[^>]*>(.*?)<\/[^>]*>/gs;
  const text = html.replace(regex, '$1').trim();
  return text;
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
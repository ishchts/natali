const parserRSS = (data) => {
  const parser = new DOMParser();
  const rssXML = parser.parseFromString(data, 'text/xml');

  const parserErrors = rssXML.querySelector('parser error');
  if (parserErrors !== null) {
    const error = parserErrors.textContent;
    throw new Error(error);
  }

const rssItems = rssXML.getElementsByTagName('item');

const posts = Array.from(rssItems).map((rssItem) => {
    const postTitle = rssItem.querySelector('title').textContent;
    const postDescription = rssItem.querySelector('description').textContent;
    const postHref = rssItem.querySelector('link').textContent;

    return { postTitle, postDescription, postHref };
});

  const feedTitle = rssXML.querySelector('channel > title').textContent;
  const feedDescription = rssXML.querySelector(
    'channel > description',
).textContent;

  return { feedTitle, feedDescription, posts };
};
export default parserRSS;

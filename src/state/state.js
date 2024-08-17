const state = {
  feeds: [], // Список добавленных RSS-потоков
};

export const addFeed = (url) => {
  state.feeds.push({ url });
};

export const getFeeds = () => state.feeds;
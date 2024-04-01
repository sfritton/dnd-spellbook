const headers: HeadersInit = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.5',
  'cache-control': 'max-age=0',
  'sec-gpc': '1',
  'upgrade-insecure-requests': '1',
};

export const fetchDndPage = (url: string) =>
  fetch(`http://dnd5e.wikidot.com${url}`, {
    headers,
    body: null,
    method: 'GET',
  });

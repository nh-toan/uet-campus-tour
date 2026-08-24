const requestCache = new Map();

export function api(path) {
  const cachedRequest = requestCache.get(path);
  if (cachedRequest) return cachedRequest;

  let request;
  request = fetch(`/api${path}`)
    .then(async response => {
      const data = await response.json().catch(() => ({ error: 'API không trả về dữ liệu hợp lệ.' }));
      if (!response.ok) throw new Error(data.error || 'Không thể tải dữ liệu.');
      return data;
    })
    .catch(error => {
      if (requestCache.get(path) === request) requestCache.delete(path);
      throw error;
    });

  requestCache.set(path, request);
  return request;
}

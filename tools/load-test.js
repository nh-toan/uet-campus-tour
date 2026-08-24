const http = require('node:http');

const baseUrl = new URL(process.env.LOAD_TEST_BASE_URL || 'http://127.0.0.1:3001');
const routes = ['/', '/gioi-thieu', '/api/clubs', '/api/lien-chi'];
const concurrencyLevels = [20, 50, 100, 200];
const agent = new http.Agent({ keepAlive: true, maxSockets: 240 });

function percentile(values, ratio) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1)];
}

function requestPath(pathname) {
  const startedAt = process.hrtime.bigint();
  return new Promise(resolve => {
    const request = http.request({ hostname: baseUrl.hostname, port: baseUrl.port, path: pathname, method: 'GET', agent }, response => {
      response.resume();
      response.on('end', () => resolve({
        statusCode: response.statusCode || 0,
        latencyMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000
      }));
    });
    request.on('error', error => resolve({ statusCode: 0, latencyMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000, error: error.message }));
    request.end();
  });
}

async function runLevel(concurrency) {
  const totalRequests = Math.max(800, concurrency * 10);
  let nextRequest = 0;
  const results = [];
  const startedAt = process.hrtime.bigint();
  async function worker() {
    while (nextRequest < totalRequests) {
      const index = nextRequest++;
      results.push(await requestPath(routes[index % routes.length]));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
  const latencies = results.map(result => result.latencyMs);
  const errors = results.filter(result => result.statusCode !== 200);
  return {
    concurrency,
    requests: totalRequests,
    requestsPerSecond: Number((totalRequests / durationSeconds).toFixed(1)),
    p50Ms: Number(percentile(latencies, 0.5).toFixed(2)),
    p95Ms: Number(percentile(latencies, 0.95).toFixed(2)),
    p99Ms: Number(percentile(latencies, 0.99).toFixed(2)),
    errorCount: errors.length,
    unexpected5xx: errors.filter(result => result.statusCode >= 500).length
  };
}

(async () => {
  const results = [];
  for (const concurrency of concurrencyLevels) results.push(await runLevel(concurrency));
  agent.destroy();
  console.log(JSON.stringify({ target: baseUrl.origin, routes, results }, null, 2));
  if (results.some(result => result.errorCount > 0)) process.exitCode = 1;
})().catch(error => {
  agent.destroy();
  console.error(error);
  process.exitCode = 1;
});

const a = { post: async (url, body, opts) => (globalThis.__AI_MOCK && String(url).startsWith("https://ai.mock.test/") ? globalThis.__AI_MOCK(url, body, opts) : /recaptcha/.test(url) ? { data: { success: true, score: 0.9 } } : { data: {} }), get: async () => ({ data: {} }), create() { return a; } };
export default a;

const a = { post: async (url) => (/recaptcha/.test(url) ? { data: { success: true, score: 0.9 } } : { data: {} }), get: async () => ({ data: {} }), create() { return a; } };
export default a;

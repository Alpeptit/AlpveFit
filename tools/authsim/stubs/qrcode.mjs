export default { toDataURL: async (s) => "data:image/png;base64," + Buffer.from(s).toString("base64") };

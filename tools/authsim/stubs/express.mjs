export const ROUTES = [];
function Router() {
  const r = { stack: [] };
  for (const m of ["get", "post", "put", "patch", "delete", "use", "all"]) r[m] = (path, ...h) => { ROUTES.push({ method: m.toUpperCase(), path, handlers: h }); return r; };
  return r;
}
function express() { return Router(); }
express.Router = Router; express.json = () => (q, s, n) => n(); express.static = () => (q, s, n) => n(); express.urlencoded = express.json;
export default express;
export { Router };

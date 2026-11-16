// M-05 (4. bağımsız denetim, v4) düzeltmesi: Express 4, async route
// handler'larının reddedilen (rejected) promise'lerini OTOMATİK yakalamaz.
// ÖNCEDEN bir handler içinde yakalanmayan bir DB/ağ hatası:
//   - genel hata middleware'ine (server.js) HİÇ ulaşmıyordu,
//   - istemci YANIT ALAMADAN zaman aşımına kadar bekliyordu,
//   - sadece process "unhandledRejection" loguna düşüyordu.
//
// Bu modül, express-async-errors gibi Express'in İÇ dosyalarını
// (lib/router/layer.js) yamalayan bir yaklaşım yerine, SADECE Router'ın
// genel API'sini (router.get/post/...) sarmalar — Express sürüm
// değişikliklerine karşı daha dayanıklıdır ve saf mantığı Express
// kurulu olmadan da gerçekten çalıştırılarak test edilebilir.

/**
 * Bir route handler'ını sarmalar: senkron bir hata fırlatırsa VEYA
 * döndürdüğü promise reddedilirse, hata next(err) ile genel hata
 * middleware'ine iletilir. 4 parametreli hata middleware'lerine dokunulmaz.
 */
export function wrapAsync(fn) {
  if (typeof fn !== "function" || fn.length >= 4) return fn;
  return function wrappedHandler(req, res, next) {
    try {
      const result = fn(req, res, next);
      if (result && typeof result.then === "function") {
        result.catch(next);
      }
      return result;
    } catch (err) {
      next(err);
    }
  };
}

const ROUTE_METHODS = ["get", "post", "put", "patch", "delete", "all"];

/**
 * Bir Router örneğinin route metodlarını, verilen TÜM handler'ları
 * wrapAsync ile saracak şekilde yamalar. Path (ilk argüman, string/RegExp)
 * ve dizi halinde verilen handler'lar doğru şekilde ele alınır.
 */
export function withAsyncErrors(router) {
  for (const method of ROUTE_METHODS) {
    const original = router[method];
    if (typeof original !== "function") continue;
    router[method] = function patchedRouteMethod(...args) {
      const wrapped = args.map((arg) =>
        Array.isArray(arg) ? arg.map(wrapAsync) : wrapAsync(arg)
      );
      return original.apply(this, wrapped);
    };
  }
  return router;
}

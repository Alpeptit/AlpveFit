# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 1 |
| Low | 2 |
| Informational | 6 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Info | Informational | https://www.alpvefit.com | Percentage of responses with status code 2xx | 97 % |
| Info | Informational | https://www.alpvefit.com | Percentage of responses with status code 4xx | 2 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type application/javascript | 75 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type application/manifest+json | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type font/woff | 6 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type image/png | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type image/svg+xml | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type text/css | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type text/html | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with content type text/plain | 3 % |
| Info | Informational | https://www.alpvefit.com | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://www.alpvefit.com | Count of total endpoints | 33    |
| Info | Informational | https://www.alpvefit.com | Percentage of slow responses | 37 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: style-src unsafe-inline | Medium | 2 |
| Cross-Origin-Embedder-Policy Header Missing or Invalid | Low | 1 |
| Permissions Policy Header Not Set | Low | 5 |
| Information Disclosure - Suspicious Comments | Informational | 5 |
| Modern Web Application | Informational | 2 |
| Re-examine Cache-control Directives | Informational | 3 |
| Retrieved from Cache | Informational | Systemic |
| Storable and Cacheable Content | Informational | Systemic |
| Storable but Non-Cacheable Content | Informational | 2 |




## Alert Detail



### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: https://www.alpvefit.com
  * Node Name: `https://www.alpvefit.com`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: https://www.alpvefit.com/sitemap.xml
  * Node Name: `https://www.alpvefit.com/sitemap.xml`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`


Instances: 2

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cross-Origin-Embedder-Policy Header Missing or Invalid ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Embedder-Policy header is a response header that prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).

* URL: https://www.alpvefit.com
  * Node Name: `https://www.alpvefit.com`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 1

### Solution

Ensure that the application/web server sets the Cross-Origin-Embedder-Policy header appropriately, and that it sets the Cross-Origin-Embedder-Policy header to 'require-corp' for documents.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Embedder-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Permissions Policy Header Not Set ](https://www.zaproxy.org/docs/alerts/10063/)



##### Low (Medium)

### Description

Permissions Policy Header is an added layer of security that helps to restrict from unauthorized access or usage of browser/client features by web resources. This policy ensures the user privacy by limiting or specifying the features of the browsers can be used by the web resources. Permissions Policy provides a set of standard HTTP headers that allow website owners to limit which features of browsers can be used by the page such as camera, microphone, location, full screen etc.

* URL: https://www.alpvefit.com/assets/avf-account.js%3Fv=1e93f819e4
  * Node Name: `https://www.alpvefit.com/assets/avf-account.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/avf-dose.js%3Fv=ffe029dc88
  * Node Name: `https://www.alpvefit.com/assets/avf-dose.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/avf-fx.js%3Fv=ec0832d1e8
  * Node Name: `https://www.alpvefit.com/assets/avf-fx.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/avf-mascot.js%3Fv=a03d55ba7d
  * Node Name: `https://www.alpvefit.com/assets/avf-mascot.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/avf-progress.js%3Fv=b6bab72fcf
  * Node Name: `https://www.alpvefit.com/assets/avf-progress.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 5

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Permissions-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
* [ https://developer.chrome.com/blog/feature-policy/ ](https://developer.chrome.com/blog/feature-policy/)
* [ https://scotthelme.co.uk/a-new-security-header-feature-policy/ ](https://scotthelme.co.uk/a-new-security-header-feature-policy/)
* [ https://w3c.github.io/webappsec-feature-policy/ ](https://w3c.github.io/webappsec-feature-policy/)
* [ https://www.smashingmagazine.com/2018/12/feature-policy/ ](https://www.smashingmagazine.com/2018/12/feature-policy/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Information Disclosure - Suspicious Comments ](https://www.zaproxy.org/docs/alerts/10027/)



##### Informational (Medium)

### Description

The response appears to contain suspicious comments which may help an attacker.

* URL: https://www.alpvefit.com/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `https://www.alpvefit.com/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `(tek seçim). Yerel <select> seçeneklerinde iko`
  * Other Info: `The following pattern was used: \bSELECT\b and was detected in likely comment: "// Logolu açılır liste (tek seçim). Yerel <select> seçeneklerinde ikon gösterilemediği için erişilebilir bir liste kutusu:", see evidence field for the suspicious comment/snippet.`
* URL: https://www.alpvefit.com/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `https://www.alpvefit.com/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `ctx() → { fullName, username }.`
  * Other Info: `The following pattern was used: \bUSERNAME\b and was detected in likely comment: "// Şifre kuralları: yazdıkça her kural işaretlenir ve çubuk dolar. ctx() → { fullName, username }.", see evidence field for the suspicious comment/snippet.`
* URL: https://www.alpvefit.com/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `https://www.alpvefit.com/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `tachments/" | "/api/admin/attachments/"), rea`
  * Other Info: `The following pattern was used: \bADMIN\b and was detected in likely comment: "// o: { scope, files: [mevcut], max, base ("/api/attachments/" | "/api/admin/attachments/"), readOnly, locked (metin), onChange ", see evidence field for the suspicious comment/snippet.`
* URL: https://www.alpvefit.com/assets/avf-plans.js%3Fv=0743951c43
  * Node Name: `https://www.alpvefit.com/assets/avf-plans.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `n-catalog veya /api/admin/plan-catalog). Hesa`
  * Other Info: `The following pattern was used: \bADMIN\b and was detected in likely comment: "/* AlpveFit — yapılandırılmış planlar: gösterim (üye paneli + uzman önizlemesi) ve oluşturucu (uzman / yönetici paneli).
   Kata", see evidence field for the suspicious comment/snippet.`
* URL: https://www.alpvefit.com/assets/avf-progress.js%3Fv=b6bab72fcf
  * Node Name: `https://www.alpvefit.com/assets/avf-progress.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `/** opts: { admin: bool, memberId } *`
  * Other Info: `The following pattern was used: \bADMIN\b and was detected in likely comment: "/** opts: { admin: bool, memberId } */", see evidence field for the suspicious comment/snippet.`


Instances: 5

### Solution

Remove all comments that return information that may help an attacker and fix any underlying problems they refer to.

### Reference



#### CWE Id: [ 615 ](https://cwe.mitre.org/data/definitions/615.html)


#### WASC Id: 13

#### Source ID: 3

### [ Modern Web Application ](https://www.zaproxy.org/docs/alerts/10109/)



##### Informational (Medium)

### Description

The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.

* URL: https://www.alpvefit.com
  * Node Name: `https://www.alpvefit.com`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: https://www.alpvefit.com/sitemap.xml
  * Node Name: `https://www.alpvefit.com/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`


Instances: 2

### Solution

This is an informational alert and so no changes are required.

### Reference




#### Source ID: 3

### [ Re-examine Cache-control Directives ](https://www.zaproxy.org/docs/alerts/10015/)



##### Informational (Low)

### Description

The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.

* URL: https://www.alpvefit.com
  * Node Name: `https://www.alpvefit.com`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``
* URL: https://www.alpvefit.com/manifest.webmanifest
  * Node Name: `https://www.alpvefit.com/manifest.webmanifest`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=3600`
  * Other Info: ``
* URL: https://www.alpvefit.com/robots.txt
  * Node Name: `https://www.alpvefit.com/robots.txt`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `max-age=14400`
  * Other Info: ``


Instances: 3

### Solution

For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching ](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching)
* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
* [ https://grayduck.mn/2021/09/13/cache-control-recommendations/ ](https://grayduck.mn/2021/09/13/cache-control-recommendations/)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### WASC Id: 13

#### Source ID: 3

### [ Retrieved from Cache ](https://www.zaproxy.org/docs/alerts/10050/)



##### Informational (Medium)

### Description

The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

* URL: https://www.alpvefit.com/assets/avf-i18n.js%3Fv=69c1050e74
  * Node Name: `https://www.alpvefit.com/assets/avf-i18n.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Age: 635053`
  * Other Info: `The presence of the 'Age' header indicates that a HTTP/1.1 compliant caching server is in use.`
* URL: https://www.alpvefit.com/assets/avf-legal.js%3Fv=3312fd75fd
  * Node Name: `https://www.alpvefit.com/assets/avf-legal.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Age: 29415`
  * Other Info: `The presence of the 'Age' header indicates that a HTTP/1.1 compliant caching server is in use.`
* URL: https://www.alpvefit.com/assets/avf-pwa.js%3Fv=215d98fa2b
  * Node Name: `https://www.alpvefit.com/assets/avf-pwa.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Age: 466783`
  * Other Info: `The presence of the 'Age' header indicates that a HTTP/1.1 compliant caching server is in use.`
* URL: https://www.alpvefit.com/assets/avf-theme.js%3Fv=2caa019dff
  * Node Name: `https://www.alpvefit.com/assets/avf-theme.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Age: 569232`
  * Other Info: `The presence of the 'Age' header indicates that a HTTP/1.1 compliant caching server is in use.`
* URL: https://www.alpvefit.com/assets/favicon.svg
  * Node Name: `https://www.alpvefit.com/assets/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Age: 644466`
  * Other Info: `The presence of the 'Age' header indicates that a HTTP/1.1 compliant caching server is in use.`

Instances: Systemic


### Solution

Validate that the response does not contain sensitive, personal or user-specific information. If it does, consider the use of the following HTTP response headers, to limit, or prevent the content being stored and retrieved from the cache by another user:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
This configuration directs both HTTP 1.0 and HTTP 1.1 compliant caching servers to not store the response, and to not retrieve the response (without validation) from the cache, in response to a similar request.

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.rfc-editor.org/rfc/rfc9110.html ](https://www.rfc-editor.org/rfc/rfc9110.html)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### Source ID: 3

### [ Storable and Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, and may be retrieved directly from the cache, rather than from the origin server by the caching servers, in response to similar requests from other users. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where "shared" caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

* URL: https://www.alpvefit.com/assets/avf-pwa.js%3Fv=215d98fa2b
  * Node Name: `https://www.alpvefit.com/assets/avf-pwa.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/avf-theme.js%3Fv=2caa019dff
  * Node Name: `https://www.alpvefit.com/assets/avf-theme.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: https://www.alpvefit.com/assets/favicon.svg
  * Node Name: `https://www.alpvefit.com/assets/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: https://www.alpvefit.com/manifest.webmanifest
  * Node Name: `https://www.alpvefit.com/manifest.webmanifest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=3600`
  * Other Info: ``
* URL: https://www.alpvefit.com/robots.txt
  * Node Name: `https://www.alpvefit.com/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=14400`
  * Other Info: ``

Instances: Systemic


### Solution

Validate that the response does not contain sensitive, personal or user-specific information. If it does, consider the use of the following HTTP response headers, to limit, or prevent the content being stored and retrieved from the cache by another user:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
This configuration directs both HTTP 1.0 and HTTP 1.1 compliant caching servers to not store the response, and to not retrieve the response (without validation) from the cache, in response to a similar request.

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: https://www.alpvefit.com
  * Node Name: `https://www.alpvefit.com`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``
* URL: https://www.alpvefit.com/sitemap.xml
  * Node Name: `https://www.alpvefit.com/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``


Instances: 2

### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3



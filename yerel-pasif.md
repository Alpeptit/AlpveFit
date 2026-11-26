# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 1 |
| Low | 1 |
| Informational | 6 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 2xx | 82 % |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 3xx | 4 % |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 4xx | 13 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type application/javascript | 41 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type application/json | 8 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type application/manifest+json | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type font/woff | 8 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type image/png | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type image/svg+xml | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type text/css | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type text/html | 31 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type text/javascript | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method GET | 98 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method POST | 1 % |
| Info | Informational | http://localhost:3000 | Count of total endpoints | 60    |
| Info | Informational | https://mail.google.com | Percentage of endpoints with content type application/binary | 100 % |
| Info | Informational | https://mail.google.com | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://mail.google.com | Count of total endpoints | 1    |
| Info | Informational | https://ssl.gstatic.com | Percentage of endpoints with content type image/x-icon | 100 % |
| Info | Informational | https://ssl.gstatic.com | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://ssl.gstatic.com | Count of total endpoints | 1    |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: style-src unsafe-inline | Medium | Systemic |
| Cross-Origin-Embedder-Policy Header Missing or Invalid | Low | Systemic |
| Information Disclosure - Information in Browser localStorage | Informational | 4 |
| Information Disclosure - Information in Browser sessionStorage | Informational | 4 |
| Information Disclosure - Suspicious Comments | Informational | 5 |
| Modern Web Application | Informational | Systemic |
| Storable and Cacheable Content | Informational | Systemic |
| Storable but Non-Cacheable Content | Informational | 3 |




## Alert Detail



### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/robots.txt
  * Node Name: `http://localhost:3000/robots.txt`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/sitemap.xml
  * Node Name: `http://localhost:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/sss
  * Node Name: `http://localhost:3000/sss`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://www.gstatic.com https://media.giphy.com https://media0.giphy.com https://media1.giphy.com https://media2.giphy.com https://media3.giphy.com https://media4.giphy.com https://i.giphy.com; connect-src 'self' https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`

Instances: Systemic


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

* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://localhost:3000/forum
  * Node Name: `http://localhost:3000/forum`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://localhost:3000/hakkimizda
  * Node Name: `http://localhost:3000/hakkimizda`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://localhost:3000/sss
  * Node Name: `http://localhost:3000/sss`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that the application/web server sets the Cross-Origin-Embedder-Policy header appropriately, and that it sets the Cross-Origin-Embedder-Policy header to 'require-corp' for documents.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Embedder-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Information Disclosure - Information in Browser localStorage ](https://www.zaproxy.org/docs/alerts/120000/)



##### Informational (High)

### Description

Information was stored in browser localStorage.
This is not unusual or necessarily unsafe - this informational alert has been raised to help you get a better understanding of what this app is doing. For more details see the Client tabs - this information was set directly in the browser and will therefore not necessarily appear in this form in any HTTP(S) messages.

* URL: http://localhost:3000/araclar
  * Node Name: `http://localhost:3000/araclar`
  * Method: `GET`
  * Parameter: `avf_units`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_units=met
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/forum
  * Node Name: `http://localhost:3000/forum`
  * Method: `GET`
  * Parameter: `avf_units`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_units=imp
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/hakkimizda
  * Node Name: `http://localhost:3000/hakkimizda`
  * Method: `GET`
  * Parameter: `avf_cookie`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_cookie={"c":"ess","v":2,"t":1795705580239}
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/sss
  * Node Name: `http://localhost:3000/sss`
  * Method: `GET`
  * Parameter: `avf_cookie`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_cookie={"c":"ess","v":2,"t":1795705598776}
Note that this alert will only be raised once for each URL + key.`


Instances: 4

### Solution

This is an informational alert and no action is necessary. 

### Reference



#### CWE Id: [ 359 ](https://cwe.mitre.org/data/definitions/359.html)


#### WASC Id: 13

#### Source ID: 3

### [ Information Disclosure - Information in Browser sessionStorage ](https://www.zaproxy.org/docs/alerts/120000/)



##### Informational (High)

### Description

Information was stored in browser sessionStorage.
This is not unusual or necessarily unsafe - this informational alert has been raised to help you get a better understanding of what this app is doing. For more details see the Client tabs - this information was set directly in the browser and will therefore not necessarily appear in this form in any HTTP(S) messages.

* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: `avf_auth_view`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_auth_view=login
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/forum
  * Node Name: `http://localhost:3000/forum`
  * Method: `GET`
  * Parameter: `avf_auth_view`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_auth_view=register
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/forum
  * Node Name: `http://localhost:3000/forum`
  * Method: `GET`
  * Parameter: `avf_forum_18`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_forum_18=1
Note that this alert will only be raised once for each URL + key.`
* URL: http://localhost:3000/sss
  * Node Name: `http://localhost:3000/sss`
  * Method: `GET`
  * Parameter: `avf_sid`
  * Attack: ``
  * Evidence: ``
  * Other Info: `The following data (key=value) was set: avf_sid=9a0b52706bc287fcceb83dfcc6e478d0
Note that this alert will only be raised once for each URL + key.`


Instances: 4

### Solution

This is an informational alert and no action is necessary. 

### Reference



#### CWE Id: [ 359 ](https://cwe.mitre.org/data/definitions/359.html)


#### WASC Id: 13

#### Source ID: 3

### [ Information Disclosure - Suspicious Comments ](https://www.zaproxy.org/docs/alerts/10027/)



##### Informational (Medium)

### Description

The response appears to contain suspicious comments which may help an attacker.

* URL: http://localhost:3000/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `http://localhost:3000/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `(tek seçim). Yerel <select> seçeneklerinde iko`
  * Other Info: `The following pattern was used: \bSELECT\b and was detected in likely comment: "// Logolu açılır liste (tek seçim). Yerel <select> seçeneklerinde ikon gösterilemediği için erişilebilir bir liste kutusu:", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:3000/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `http://localhost:3000/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `ctx() → { fullName, username }.`
  * Other Info: `The following pattern was used: \bUSERNAME\b and was detected in likely comment: "// Şifre kuralları: yazdıkça her kural işaretlenir ve çubuk dolar. ctx() → { fullName, username }.", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:3000/assets/avf-core.js%3Fv=1e625e1000
  * Node Name: `http://localhost:3000/assets/avf-core.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `tachments/" | "/api/admin/attachments/"), rea`
  * Other Info: `The following pattern was used: \bADMIN\b and was detected in likely comment: "// o: { scope, files: [mevcut], max, base ("/api/attachments/" | "/api/admin/attachments/"), readOnly, locked (metin), onChange ", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:3000/assets/avf-plans.js%3Fv=0743951c43
  * Node Name: `http://localhost:3000/assets/avf-plans.js (v)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `n-catalog veya /api/admin/plan-catalog). Hesa`
  * Other Info: `The following pattern was used: \bADMIN\b and was detected in likely comment: "/* AlpveFit — yapılandırılmış planlar: gösterim (üye paneli + uzman önizlemesi) ve oluşturucu (uzman / yönetici paneli).
   Kata", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:3000/assets/avf-progress.js%3Fv=b6bab72fcf
  * Node Name: `http://localhost:3000/assets/avf-progress.js (v)`
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

* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://localhost:3000/robots.txt
  * Node Name: `http://localhost:3000/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://localhost:3000/sitemap.xml
  * Node Name: `http://localhost:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://localhost:3000/sss
  * Node Name: `http://localhost:3000/sss`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script src="/assets/avf-theme.js?v=2caa019dff"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`

Instances: Systemic


### Solution

This is an informational alert and so no changes are required.

### Reference




#### Source ID: 3

### [ Storable and Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, and may be retrieved directly from the cache, rather than from the origin server by the caching servers, in response to similar requests from other users. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where "shared" caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

* URL: http://localhost:3000/assets/favicon.svg
  * Node Name: `http://localhost:3000/assets/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: http://localhost:3000/assets/fonts/Inter-Regular.woff
  * Node Name: `http://localhost:3000/assets/fonts/Inter-Regular.woff`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: http://localhost:3000/assets/fonts/InterDisplay-Bold.woff
  * Node Name: `http://localhost:3000/assets/fonts/InterDisplay-Bold.woff`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: http://localhost:3000/assets/icons/apple-touch-icon.png
  * Node Name: `http://localhost:3000/assets/icons/apple-touch-icon.png`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: http://localhost:3000/manifest.webmanifest
  * Node Name: `http://localhost:3000/manifest.webmanifest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=3600`
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

* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``
* URL: http://localhost:3000/robots.txt
  * Node Name: `http://localhost:3000/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``
* URL: http://localhost:3000/sitemap.xml
  * Node Name: `http://localhost:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-cache`
  * Other Info: ``


Instances: 3

### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3



# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 1 |
| Low | 1 |
| Informational | 2 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Medium | Exceeded High | http://localhost:3000 | Percentage of responses with status code 4xx | 99 % |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 2xx | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type text/html | 99 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method DELETE | 5 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method GET | 59 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PATCH | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method POST | 30 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PUT | 3 % |
| Info | Informational | http://localhost:3000 | Count of total endpoints | 503    |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: style-src unsafe-inline | Medium | Systemic |
| Unexpected Content-Type was returned | Low | 503 |
| A Client Error response code was returned by the server | Informational | 501 |
| Non-Storable Content | Informational | Systemic |




## Alert Detail



### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: http://localhost:3000/api/account/login-history
  * Node Name: `http://localhost:3000/api/account/login-history`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
  * Method: `POST`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/api/account/request-name-change
  * Node Name: `http://localhost:3000/api/account/request-name-change ()({newName})`
  * Method: `POST`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/api/account/request-password-change
  * Node Name: `http://localhost:3000/api/account/request-password-change ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/api/account/resend-code
  * Node Name: `http://localhost:3000/api/account/resend-code ()({purpose})`
  * Method: `POST`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
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

### [ Unexpected Content-Type was returned ](https://www.zaproxy.org/docs/alerts/100001/)



##### Low (High)

### Description

A Content-Type of text/html was returned by the server.
This is not one of the types expected to be returned by an API.
Raised by the 'Alert on Unexpected Content Types' script

* URL: http://localhost:3000/api/admin/assignments
  * Node Name: `http://localhost:3000/api/admin/assignments`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments/
  * Node Name: `http://localhost:3000/api/admin/assignments/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test
  * Node Name: `http://localhost:3000/api/board/mod/ban/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test/
  * Node Name: `http://localhost:3000/api/board/mod/ban/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test
  * Node Name: `http://localhost:3000/api/forum/me/media/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test/
  * Node Name: `http://localhost:3000/api/forum/me/media/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications
  * Node Name: `http://localhost:3000/api/notifications`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/
  * Node Name: `http://localhost:3000/api/notifications/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/3578204138472717071
  * Node Name: `http://localhost:3000/3578204138472717071`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api
  * Node Name: `http://localhost:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/
  * Node Name: `http://localhost:3000/api/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa
  * Node Name: `http://localhost:3000/api/2fa`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/
  * Node Name: `http://localhost:3000/api/2fa/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/1882253451613023006
  * Node Name: `http://localhost:3000/api/2fa/1882253451613023006`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/actuator/health
  * Node Name: `http://localhost:3000/api/2fa/actuator/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery
  * Node Name: `http://localhost:3000/api/2fa/recovery`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/
  * Node Name: `http://localhost:3000/api/2fa/recovery/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/7049940038448647858
  * Node Name: `http://localhost:3000/api/2fa/recovery/7049940038448647858`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew
  * Node Name: `http://localhost:3000/api/2fa/renew`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/
  * Node Name: `http://localhost:3000/api/2fa/renew/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/5184782202256181493
  * Node Name: `http://localhost:3000/api/2fa/renew/5184782202256181493`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/638570983148011570
  * Node Name: `http://localhost:3000/api/638570983148011570`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account
  * Node Name: `http://localhost:3000/api/account`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/
  * Node Name: `http://localhost:3000/api/account/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/6578315499701883958
  * Node Name: `http://localhost:3000/api/account/6578315499701883958`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/login-history
  * Node Name: `http://localhost:3000/api/account/login-history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/login-history/
  * Node Name: `http://localhost:3000/api/account/login-history/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset
  * Node Name: `http://localhost:3000/api/account/password-reset`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/
  * Node Name: `http://localhost:3000/api/account/password-reset/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/6215934915174008477
  * Node Name: `http://localhost:3000/api/account/password-reset/6215934915174008477`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin
  * Node Name: `http://localhost:3000/api/admin`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/
  * Node Name: `http://localhost:3000/api/admin/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/2651273655345557680
  * Node Name: `http://localhost:3000/api/admin/2651273655345557680`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments
  * Node Name: `http://localhost:3000/api/admin/attachments`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/
  * Node Name: `http://localhost:3000/api/admin/attachments/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/9060655563323805829
  * Node Name: `http://localhost:3000/api/admin/attachments/9060655563323805829`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit
  * Node Name: `http://localhost:3000/api/admin/audit`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/
  * Node Name: `http://localhost:3000/api/admin/audit/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/6601567038489343041
  * Node Name: `http://localhost:3000/api/admin/audit/6601567038489343041`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/actions
  * Node Name: `http://localhost:3000/api/admin/audit/actions`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/actions/
  * Node Name: `http://localhost:3000/api/admin/audit/actions/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients
  * Node Name: `http://localhost:3000/api/admin/clients`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/
  * Node Name: `http://localhost:3000/api/admin/clients/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7404411277706657090
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7404411277706657090`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/4320909605005974694
  * Node Name: `http://localhost:3000/api/admin/clients/4320909605005974694`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media
  * Node Name: `http://localhost:3000/api/admin/dm-media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/
  * Node Name: `http://localhost:3000/api/admin/dm-media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/1063600829966600902
  * Node Name: `http://localhost:3000/api/admin/dm-media/1063600829966600902`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports
  * Node Name: `http://localhost:3000/api/admin/dm-reports`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8616159293649052244
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8616159293649052244`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/5628614173140964592
  * Node Name: `http://localhost:3000/api/admin/dm-reports/5628614173140964592`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum
  * Node Name: `http://localhost:3000/api/admin/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/
  * Node Name: `http://localhost:3000/api/admin/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/6834321330967727717
  * Node Name: `http://localhost:3000/api/admin/forum/6834321330967727717`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/levels
  * Node Name: `http://localhost:3000/api/admin/forum/levels`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/levels/
  * Node Name: `http://localhost:3000/api/admin/forum/levels/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/me
  * Node Name: `http://localhost:3000/api/admin/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/me/
  * Node Name: `http://localhost:3000/api/admin/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members
  * Node Name: `http://localhost:3000/api/admin/members`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/
  * Node Name: `http://localhost:3000/api/admin/members/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/5353015091150117293
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/5353015091150117293`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/6520910840050578692
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/6520910840050578692`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/8374002005925364128
  * Node Name: `http://localhost:3000/api/admin/members/8374002005925364128`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders
  * Node Name: `http://localhost:3000/api/admin/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/
  * Node Name: `http://localhost:3000/api/admin/orders/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/2644873984562222290
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/2644873984562222290`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/3919516100597646853
  * Node Name: `http://localhost:3000/api/admin/orders/3919516100597646853`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plan-catalog
  * Node Name: `http://localhost:3000/api/admin/plan-catalog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plan-catalog/
  * Node Name: `http://localhost:3000/api/admin/plan-catalog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans
  * Node Name: `http://localhost:3000/api/admin/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/
  * Node Name: `http://localhost:3000/api/admin/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1721768582349116924
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1721768582349116924`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/6107504009517484819
  * Node Name: `http://localhost:3000/api/admin/plans/6107504009517484819`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support
  * Node Name: `http://localhost:3000/api/admin/support`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/
  * Node Name: `http://localhost:3000/api/admin/support/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/3040104661397453010
  * Node Name: `http://localhost:3000/api/admin/support/3040104661397453010`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/summary
  * Node Name: `http://localhost:3000/api/admin/support/summary`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/summary/
  * Node Name: `http://localhost:3000/api/admin/support/summary/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets
  * Node Name: `http://localhost:3000/api/admin/tickets`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/
  * Node Name: `http://localhost:3000/api/admin/tickets/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/2569029048582189810
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/2569029048582189810`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/6288871615813155206
  * Node Name: `http://localhost:3000/api/admin/tickets/6288871615813155206`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users
  * Node Name: `http://localhost:3000/api/admin/users`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/
  * Node Name: `http://localhost:3000/api/admin/users/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/7607472348699995126
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/7607472348699995126`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/4938451738060831060
  * Node Name: `http://localhost:3000/api/admin/users/4938451738060831060`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments
  * Node Name: `http://localhost:3000/api/attachments`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/
  * Node Name: `http://localhost:3000/api/attachments/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/2663393165892092974
  * Node Name: `http://localhost:3000/api/attachments/2663393165892092974`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth
  * Node Name: `http://localhost:3000/api/auth`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/
  * Node Name: `http://localhost:3000/api/auth/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/9074666594920310953
  * Node Name: `http://localhost:3000/api/auth/9074666594920310953`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/
  * Node Name: `http://localhost:3000/api/auth/login/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/3556517585693368879
  * Node Name: `http://localhost:3000/api/auth/login/3556517585693368879`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/me/
  * Node Name: `http://localhost:3000/api/auth/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/
  * Node Name: `http://localhost:3000/api/auth/register/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/974193626538157325
  * Node Name: `http://localhost:3000/api/auth/register/974193626538157325`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password
  * Node Name: `http://localhost:3000/api/auth/reset-password`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/
  * Node Name: `http://localhost:3000/api/auth/reset-password/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/1529359894018084807
  * Node Name: `http://localhost:3000/api/auth/reset-password/1529359894018084807`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/blog
  * Node Name: `http://localhost:3000/api/blog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/
  * Node Name: `http://localhost:3000/api/blog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/8339285681980221621
  * Node Name: `http://localhost:3000/api/blog/8339285681980221621`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/test
  * Node Name: `http://localhost:3000/api/blog/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/test/
  * Node Name: `http://localhost:3000/api/blog/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board
  * Node Name: `http://localhost:3000/api/board`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/
  * Node Name: `http://localhost:3000/api/board/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/6930941021494335793
  * Node Name: `http://localhost:3000/api/board/6930941021494335793`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/home
  * Node Name: `http://localhost:3000/api/board/home`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/home/
  * Node Name: `http://localhost:3000/api/board/home/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images
  * Node Name: `http://localhost:3000/api/board/images`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/
  * Node Name: `http://localhost:3000/api/board/images/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/1107155931443332263
  * Node Name: `http://localhost:3000/api/board/images/1107155931443332263`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img
  * Node Name: `http://localhost:3000/api/board/img`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/
  * Node Name: `http://localhost:3000/api/board/img/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/2487339572522887895
  * Node Name: `http://localhost:3000/api/board/img/2487339572522887895`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me
  * Node Name: `http://localhost:3000/api/board/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/
  * Node Name: `http://localhost:3000/api/board/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/4450144057723901475
  * Node Name: `http://localhost:3000/api/board/me/4450144057723901475`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/bookmarks
  * Node Name: `http://localhost:3000/api/board/me/bookmarks`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/bookmarks/
  * Node Name: `http://localhost:3000/api/board/me/bookmarks/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/likes
  * Node Name: `http://localhost:3000/api/board/me/likes`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/likes/
  * Node Name: `http://localhost:3000/api/board/me/likes/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/members
  * Node Name: `http://localhost:3000/api/board/members`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/members/
  * Node Name: `http://localhost:3000/api/board/members/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mention
  * Node Name: `http://localhost:3000/api/board/mention`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mention/
  * Node Name: `http://localhost:3000/api/board/mention/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod
  * Node Name: `http://localhost:3000/api/board/mod`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/
  * Node Name: `http://localhost:3000/api/board/mod/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/5002282826248105856
  * Node Name: `http://localhost:3000/api/board/mod/5002282826248105856`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban
  * Node Name: `http://localhost:3000/api/board/mod/ban`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/
  * Node Name: `http://localhost:3000/api/board/mod/ban/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/1681455613480455991
  * Node Name: `http://localhost:3000/api/board/mod/ban/1681455613480455991`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/bans
  * Node Name: `http://localhost:3000/api/board/mod/bans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/bans/
  * Node Name: `http://localhost:3000/api/board/mod/bans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories
  * Node Name: `http://localhost:3000/api/board/mod/categories`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/
  * Node Name: `http://localhost:3000/api/board/mod/categories/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/8544412598117917821
  * Node Name: `http://localhost:3000/api/board/mod/categories/8544412598117917821`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports
  * Node Name: `http://localhost:3000/api/board/mod/reports`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/
  * Node Name: `http://localhost:3000/api/board/mod/reports/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/2871126712386790066
  * Node Name: `http://localhost:3000/api/board/mod/reports/2871126712386790066`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts
  * Node Name: `http://localhost:3000/api/board/posts`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/
  * Node Name: `http://localhost:3000/api/board/posts/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/9175077788945764204
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/9175077788945764204`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/5516168900911045987
  * Node Name: `http://localhost:3000/api/board/posts/5516168900911045987`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/rules
  * Node Name: `http://localhost:3000/api/board/rules`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/rules/
  * Node Name: `http://localhost:3000/api/board/rules/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/search
  * Node Name: `http://localhost:3000/api/board/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/search/
  * Node Name: `http://localhost:3000/api/board/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t
  * Node Name: `http://localhost:3000/api/board/t`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/
  * Node Name: `http://localhost:3000/api/board/t/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/4717264953456883942
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/4717264953456883942`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/985710951400631045
  * Node Name: `http://localhost:3000/api/board/t/985710951400631045`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics
  * Node Name: `http://localhost:3000/api/board/topics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics/
  * Node Name: `http://localhost:3000/api/board/topics/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u
  * Node Name: `http://localhost:3000/api/board/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/
  * Node Name: `http://localhost:3000/api/board/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/4208833330492748099
  * Node Name: `http://localhost:3000/api/board/u/4208833330492748099`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/test
  * Node Name: `http://localhost:3000/api/board/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/test/
  * Node Name: `http://localhost:3000/api/board/u/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media
  * Node Name: `http://localhost:3000/api/dm-media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/
  * Node Name: `http://localhost:3000/api/dm-media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/8467235694571933949
  * Node Name: `http://localhost:3000/api/dm-media/8467235694571933949`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum
  * Node Name: `http://localhost:3000/api/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/
  * Node Name: `http://localhost:3000/api/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/4855349643712164907
  * Node Name: `http://localhost:3000/api/forum/4855349643712164907`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me
  * Node Name: `http://localhost:3000/api/forum/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/1176258764085093859
  * Node Name: `http://localhost:3000/api/forum/me/1176258764085093859`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media
  * Node Name: `http://localhost:3000/api/forum/me/media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/
  * Node Name: `http://localhost:3000/api/forum/me/media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/3621026576964250344
  * Node Name: `http://localhost:3000/api/forum/me/media/3621026576964250344`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig
  * Node Name: `http://localhost:3000/api/forum/me/media/sig`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/5699595455277479204
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/5699595455277479204`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media
  * Node Name: `http://localhost:3000/api/forum/media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/
  * Node Name: `http://localhost:3000/api/forum/media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/739655123197148714
  * Node Name: `http://localhost:3000/api/forum/media/739655123197148714`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/rules
  * Node Name: `http://localhost:3000/api/forum/rules`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/rules/
  * Node Name: `http://localhost:3000/api/forum/rules/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends
  * Node Name: `http://localhost:3000/api/friends`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/
  * Node Name: `http://localhost:3000/api/friends/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/5128735830827718025
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/5128735830827718025`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/1047341566068826845
  * Node Name: `http://localhost:3000/api/friends/1047341566068826845`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/search
  * Node Name: `http://localhost:3000/api/friends/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/search/
  * Node Name: `http://localhost:3000/api/friends/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/summary
  * Node Name: `http://localhost:3000/api/friends/summary`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/summary/
  * Node Name: `http://localhost:3000/api/friends/summary/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy
  * Node Name: `http://localhost:3000/api/giphy`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/
  * Node Name: `http://localhost:3000/api/giphy/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/1045742453235179043
  * Node Name: `http://localhost:3000/api/giphy/1045742453235179043`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/search
  * Node Name: `http://localhost:3000/api/giphy/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/search/
  * Node Name: `http://localhost:3000/api/giphy/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/status
  * Node Name: `http://localhost:3000/api/giphy/status`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/status/
  * Node Name: `http://localhost:3000/api/giphy/status/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/live
  * Node Name: `http://localhost:3000/api/live`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/live/
  * Node Name: `http://localhost:3000/api/live/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages
  * Node Name: `http://localhost:3000/api/messages`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/
  * Node Name: `http://localhost:3000/api/messages/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/123495088613168728
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/123495088613168728`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/5643837624307384963
  * Node Name: `http://localhost:3000/api/messages/5643837624307384963`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m
  * Node Name: `http://localhost:3000/api/messages/m`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/
  * Node Name: `http://localhost:3000/api/messages/m/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/7221716643910810423
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/7221716643910810423`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/3647876780698700644
  * Node Name: `http://localhost:3000/api/messages/m/3647876780698700644`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications
  * Node Name: `http://localhost:3000/api/notifications`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/
  * Node Name: `http://localhost:3000/api/notifications/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/5849755534885015137
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/5849755534885015137`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/4671884222112148903
  * Node Name: `http://localhost:3000/api/notifications/4671884222112148903`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders
  * Node Name: `http://localhost:3000/api/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/
  * Node Name: `http://localhost:3000/api/orders/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/8008798185385637598
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/8008798185385637598`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/3431385844978730100
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/3431385844978730100`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/2350574085284317914
  * Node Name: `http://localhost:3000/api/orders/2350574085284317914`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/packages
  * Node Name: `http://localhost:3000/api/packages`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/packages/
  * Node Name: `http://localhost:3000/api/packages/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plan-catalog
  * Node Name: `http://localhost:3000/api/plan-catalog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plan-catalog/
  * Node Name: `http://localhost:3000/api/plan-catalog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans
  * Node Name: `http://localhost:3000/api/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/
  * Node Name: `http://localhost:3000/api/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/2187214653167796659
  * Node Name: `http://localhost:3000/api/plans/2187214653167796659`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/overview
  * Node Name: `http://localhost:3000/api/plans/overview`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/overview/
  * Node Name: `http://localhost:3000/api/plans/overview/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress
  * Node Name: `http://localhost:3000/api/progress`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/4484465066296688521
  * Node Name: `http://localhost:3000/api/progress/4484465066296688521`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets
  * Node Name: `http://localhost:3000/api/tickets`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/
  * Node Name: `http://localhost:3000/api/tickets/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/5722093719166877205
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/5722093719166877205`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/4840022197355074997
  * Node Name: `http://localhost:3000/api/tickets/4840022197355074997`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/subjects
  * Node Name: `http://localhost:3000/api/tickets/subjects`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/subjects/
  * Node Name: `http://localhost:3000/api/tickets/subjects/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads
  * Node Name: `http://localhost:3000/api/uploads`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/
  * Node Name: `http://localhost:3000/api/uploads/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/2725548783917999162
  * Node Name: `http://localhost:3000/api/uploads/2725548783917999162`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test
  * Node Name: `http://localhost:3000/api/uploads/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test/
  * Node Name: `http://localhost:3000/api/uploads/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery ()({status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery/ ()({status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001 ()({data})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/ ()({data})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close ()({confirmed})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close/ ()({confirmed})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/activate
  * Node Name: `http://localhost:3000/api/2fa/activate ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/activate/
  * Node Name: `http://localhost:3000/api/2fa/activate/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/confirm-toggle
  * Node Name: `http://localhost:3000/api/2fa/confirm-toggle ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/confirm-toggle/
  * Node Name: `http://localhost:3000/api/2fa/confirm-toggle/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/confirm
  * Node Name: `http://localhost:3000/api/2fa/recovery/confirm ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/confirm/
  * Node Name: `http://localhost:3000/api/2fa/recovery/confirm/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/request
  * Node Name: `http://localhost:3000/api/2fa/recovery/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/request/
  * Node Name: `http://localhost:3000/api/2fa/recovery/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/activate
  * Node Name: `http://localhost:3000/api/2fa/renew/activate ()({token,renewTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/activate/
  * Node Name: `http://localhost:3000/api/2fa/renew/activate/ ()({token,renewTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/confirm
  * Node Name: `http://localhost:3000/api/2fa/renew/confirm ()({adminFactor,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/confirm/
  * Node Name: `http://localhost:3000/api/2fa/renew/confirm/ ()({adminFactor,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/request
  * Node Name: `http://localhost:3000/api/2fa/renew/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/request/
  * Node Name: `http://localhost:3000/api/2fa/renew/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/request-toggle
  * Node Name: `http://localhost:3000/api/2fa/request-toggle ()({method})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/request-toggle/
  * Node Name: `http://localhost:3000/api/2fa/request-toggle/ ()({method})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/verify-totp
  * Node Name: `http://localhost:3000/api/2fa/verify-totp ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/verify-totp/
  * Node Name: `http://localhost:3000/api/2fa/verify-totp/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change
  * Node Name: `http://localhost:3000/api/account/confirm-email-change ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change-old
  * Node Name: `http://localhost:3000/api/account/confirm-email-change-old ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change-old/
  * Node Name: `http://localhost:3000/api/account/confirm-email-change-old/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change/
  * Node Name: `http://localhost:3000/api/account/confirm-email-change/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-name-change/
  * Node Name: `http://localhost:3000/api/account/confirm-name-change/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/request
  * Node Name: `http://localhost:3000/api/account/password-reset/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/request/
  * Node Name: `http://localhost:3000/api/account/password-reset/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-email-change
  * Node Name: `http://localhost:3000/api/account/request-email-change ()({newEmail})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-email-change/
  * Node Name: `http://localhost:3000/api/account/request-email-change/ ()({newEmail})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change
  * Node Name: `http://localhost:3000/api/account/request-name-change ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change/
  * Node Name: `http://localhost:3000/api/account/request-name-change/ ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change
  * Node Name: `http://localhost:3000/api/account/request-password-change ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change/
  * Node Name: `http://localhost:3000/api/account/request-password-change/ ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code
  * Node Name: `http://localhost:3000/api/account/resend-code ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code/
  * Node Name: `http://localhost:3000/api/account/resend-code/ ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban ()({hours})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban/ ()({hours})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve ()({reason,paymentRef,kinds})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve/ ()({reason,paymentRef,kinds})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans
  * Node Name: `http://localhost:3000/api/admin/plans ()({data,memberId,kind})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/
  * Node Name: `http://localhost:3000/api/admin/plans/ ()({data,memberId,kind})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply/ ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/forgot-password
  * Node Name: `http://localhost:3000/api/auth/forgot-password ()({identifier,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/forgot-password/
  * Node Name: `http://localhost:3000/api/auth/forgot-password/ ()({identifier,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({identifier,password,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/
  * Node Name: `http://localhost:3000/api/auth/login/ ()({identifier,password,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/verify-totp
  * Node Name: `http://localhost:3000/api/auth/login/verify-totp ()({userId,token,recoveryCode,loginTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/verify-totp/
  * Node Name: `http://localhost:3000/api/auth/login/verify-totp/ ()({userId,token,recoveryCode,loginTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({fullName,username,email,password,recaptchaToken,kvkkAccepted,aboutAccepted})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/
  * Node Name: `http://localhost:3000/api/auth/register/ ()({fullName,username,email,password,recaptchaToken,kvkkAccepted,aboutAccepted})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/resend
  * Node Name: `http://localhost:3000/api/auth/register/resend ()({userId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/resend/
  * Node Name: `http://localhost:3000/api/auth/register/resend/ ()({userId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/verify
  * Node Name: `http://localhost:3000/api/auth/register/verify ()({userId,code,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/verify/
  * Node Name: `http://localhost:3000/api/auth/register/verify/ ()({userId,code,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password
  * Node Name: `http://localhost:3000/api/auth/reset-password ()({ticket,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/
  * Node Name: `http://localhost:3000/api/auth/reset-password/ ()({ticket,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/link
  * Node Name: `http://localhost:3000/api/auth/reset-password/link ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/link/
  * Node Name: `http://localhost:3000/api/auth/reset-password/link/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/resend
  * Node Name: `http://localhost:3000/api/auth/reset-password/resend ()({resetId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/resend/
  * Node Name: `http://localhost:3000/api/auth/reset-password/resend/ ()({resetId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/verify
  * Node Name: `http://localhost:3000/api/auth/reset-password/verify ()({resetId,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/verify/
  * Node Name: `http://localhost:3000/api/auth/reset-password/verify/ ()({resetId,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images
  * Node Name: `http://localhost:3000/api/board/images ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/
  * Node Name: `http://localhost:3000/api/board/images/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/giphy
  * Node Name: `http://localhost:3000/api/board/images/giphy ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/giphy/
  * Node Name: `http://localhost:3000/api/board/images/giphy/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test
  * Node Name: `http://localhost:3000/api/board/mod/ban/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test/
  * Node Name: `http://localhost:3000/api/board/mod/ban/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/read-all
  * Node Name: `http://localhost:3000/api/board/read-all ()({category})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/read-all/
  * Node Name: `http://localhost:3000/api/board/read-all/ ()({category})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics
  * Node Name: `http://localhost:3000/api/board/topics ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics/
  * Node Name: `http://localhost:3000/api/board/topics/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/giphy
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/giphy ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/giphy/
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/giphy/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test
  * Node Name: `http://localhost:3000/api/forum/me/media/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test/
  * Node Name: `http://localhost:3000/api/forum/me/media/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/request
  * Node Name: `http://localhost:3000/api/friends/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/request/
  * Node Name: `http://localhost:3000/api/friends/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/read-all
  * Node Name: `http://localhost:3000/api/notifications/read-all ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/read-all/
  * Node Name: `http://localhost:3000/api/notifications/read-all/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders
  * Node Name: `http://localhost:3000/api/orders ()({packageKey,weeks,consent})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/
  * Node Name: `http://localhost:3000/api/orders/ ()({packageKey,weeks,consent})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock ()({outcome})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock/ ()({outcome})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress
  * Node Name: `http://localhost:3000/api/progress ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets
  * Node Name: `http://localhost:3000/api/tickets ()({planKind,attachments,title,subject,message})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/
  * Node Name: `http://localhost:3000/api/tickets/ ()({planKind,attachments,title,subject,message})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages/ ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test
  * Node Name: `http://localhost:3000/api/uploads/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test/
  * Node Name: `http://localhost:3000/api/uploads/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/computeMetadata/v1/
  * Node Name: `http://localhost:3000/computeMetadata/v1/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/latest/meta-data/
  * Node Name: `http://localhost:3000/latest/meta-data/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/metadata/instance
  * Node Name: `http://localhost:3000/metadata/instance ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/metadata/v1
  * Node Name: `http://localhost:3000/metadata/v1 ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/opc/v1/instance/
  * Node Name: `http://localhost:3000/opc/v1/instance/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/opc/v2/instance/
  * Node Name: `http://localhost:3000/opc/v2/instance/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/openstack/latest/meta_data.json
  * Node Name: `http://localhost:3000/openstack/latest/meta_data.json ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments
  * Node Name: `http://localhost:3000/api/admin/assignments ()({delivery,coachId,memberId})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments/
  * Node Name: `http://localhost:3000/api/admin/assignments/ ()({delivery,coachId,memberId})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access ()({kinds})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access/ ()({kinds})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role ()({planKinds,role})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role/
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role/ ()({planKinds,role})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me
  * Node Name: `http://localhost:3000/api/forum/me ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/username
  * Node Name: `http://localhost:3000/api/forum/me/username ()({username,password})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/username/
  * Node Name: `http://localhost:3000/api/forum/me/username/ ()({username,password})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``


Instances: 503

### Solution



### Reference




#### Source ID: 4

### [ A Client Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Informational (High)

### Description

A response code of 429 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: http://localhost:3000/api/admin/assignments
  * Node Name: `http://localhost:3000/api/admin/assignments`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments/
  * Node Name: `http://localhost:3000/api/admin/assignments/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test
  * Node Name: `http://localhost:3000/api/board/mod/ban/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test/
  * Node Name: `http://localhost:3000/api/board/mod/ban/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test
  * Node Name: `http://localhost:3000/api/forum/me/media/test`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test/
  * Node Name: `http://localhost:3000/api/forum/me/media/test/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications
  * Node Name: `http://localhost:3000/api/notifications`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/
  * Node Name: `http://localhost:3000/api/notifications/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/3578204138472717071
  * Node Name: `http://localhost:3000/3578204138472717071`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api
  * Node Name: `http://localhost:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/
  * Node Name: `http://localhost:3000/api/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa
  * Node Name: `http://localhost:3000/api/2fa`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/
  * Node Name: `http://localhost:3000/api/2fa/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/1882253451613023006
  * Node Name: `http://localhost:3000/api/2fa/1882253451613023006`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/actuator/health
  * Node Name: `http://localhost:3000/api/2fa/actuator/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery
  * Node Name: `http://localhost:3000/api/2fa/recovery`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/
  * Node Name: `http://localhost:3000/api/2fa/recovery/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/7049940038448647858
  * Node Name: `http://localhost:3000/api/2fa/recovery/7049940038448647858`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew
  * Node Name: `http://localhost:3000/api/2fa/renew`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/
  * Node Name: `http://localhost:3000/api/2fa/renew/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/5184782202256181493
  * Node Name: `http://localhost:3000/api/2fa/renew/5184782202256181493`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/638570983148011570
  * Node Name: `http://localhost:3000/api/638570983148011570`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account
  * Node Name: `http://localhost:3000/api/account`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/
  * Node Name: `http://localhost:3000/api/account/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/6578315499701883958
  * Node Name: `http://localhost:3000/api/account/6578315499701883958`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/login-history
  * Node Name: `http://localhost:3000/api/account/login-history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/login-history/
  * Node Name: `http://localhost:3000/api/account/login-history/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset
  * Node Name: `http://localhost:3000/api/account/password-reset`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/
  * Node Name: `http://localhost:3000/api/account/password-reset/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/6215934915174008477
  * Node Name: `http://localhost:3000/api/account/password-reset/6215934915174008477`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin
  * Node Name: `http://localhost:3000/api/admin`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/
  * Node Name: `http://localhost:3000/api/admin/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/2651273655345557680
  * Node Name: `http://localhost:3000/api/admin/2651273655345557680`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments
  * Node Name: `http://localhost:3000/api/admin/attachments`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/
  * Node Name: `http://localhost:3000/api/admin/attachments/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/9060655563323805829
  * Node Name: `http://localhost:3000/api/admin/attachments/9060655563323805829`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit
  * Node Name: `http://localhost:3000/api/admin/audit`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/
  * Node Name: `http://localhost:3000/api/admin/audit/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/6601567038489343041
  * Node Name: `http://localhost:3000/api/admin/audit/6601567038489343041`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/actions
  * Node Name: `http://localhost:3000/api/admin/audit/actions`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/actions/
  * Node Name: `http://localhost:3000/api/admin/audit/actions/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients
  * Node Name: `http://localhost:3000/api/admin/clients`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/
  * Node Name: `http://localhost:3000/api/admin/clients/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7404411277706657090
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7404411277706657090`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/profile/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/4320909605005974694
  * Node Name: `http://localhost:3000/api/admin/clients/4320909605005974694`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media
  * Node Name: `http://localhost:3000/api/admin/dm-media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/
  * Node Name: `http://localhost:3000/api/admin/dm-media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/1063600829966600902
  * Node Name: `http://localhost:3000/api/admin/dm-media/1063600829966600902`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports
  * Node Name: `http://localhost:3000/api/admin/dm-reports`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8616159293649052244
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8616159293649052244`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/5628614173140964592
  * Node Name: `http://localhost:3000/api/admin/dm-reports/5628614173140964592`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum
  * Node Name: `http://localhost:3000/api/admin/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/
  * Node Name: `http://localhost:3000/api/admin/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/6834321330967727717
  * Node Name: `http://localhost:3000/api/admin/forum/6834321330967727717`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/levels
  * Node Name: `http://localhost:3000/api/admin/forum/levels`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/levels/
  * Node Name: `http://localhost:3000/api/admin/forum/levels/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/me
  * Node Name: `http://localhost:3000/api/admin/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/me/
  * Node Name: `http://localhost:3000/api/admin/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members
  * Node Name: `http://localhost:3000/api/admin/members`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/
  * Node Name: `http://localhost:3000/api/admin/members/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/5353015091150117293
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/5353015091150117293`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/6520910840050578692
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/6520910840050578692`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/8374002005925364128
  * Node Name: `http://localhost:3000/api/admin/members/8374002005925364128`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders
  * Node Name: `http://localhost:3000/api/admin/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/
  * Node Name: `http://localhost:3000/api/admin/orders/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/2644873984562222290
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/2644873984562222290`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/3919516100597646853
  * Node Name: `http://localhost:3000/api/admin/orders/3919516100597646853`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plan-catalog
  * Node Name: `http://localhost:3000/api/admin/plan-catalog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plan-catalog/
  * Node Name: `http://localhost:3000/api/admin/plan-catalog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans
  * Node Name: `http://localhost:3000/api/admin/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/
  * Node Name: `http://localhost:3000/api/admin/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1721768582349116924
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1721768582349116924`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/6107504009517484819
  * Node Name: `http://localhost:3000/api/admin/plans/6107504009517484819`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support
  * Node Name: `http://localhost:3000/api/admin/support`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/
  * Node Name: `http://localhost:3000/api/admin/support/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/3040104661397453010
  * Node Name: `http://localhost:3000/api/admin/support/3040104661397453010`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/summary
  * Node Name: `http://localhost:3000/api/admin/support/summary`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/summary/
  * Node Name: `http://localhost:3000/api/admin/support/summary/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets
  * Node Name: `http://localhost:3000/api/admin/tickets`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/
  * Node Name: `http://localhost:3000/api/admin/tickets/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/2569029048582189810
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/2569029048582189810`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/6288871615813155206
  * Node Name: `http://localhost:3000/api/admin/tickets/6288871615813155206`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users
  * Node Name: `http://localhost:3000/api/admin/users`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/
  * Node Name: `http://localhost:3000/api/admin/users/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/7607472348699995126
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/7607472348699995126`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/4938451738060831060
  * Node Name: `http://localhost:3000/api/admin/users/4938451738060831060`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments
  * Node Name: `http://localhost:3000/api/attachments`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/
  * Node Name: `http://localhost:3000/api/attachments/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/2663393165892092974
  * Node Name: `http://localhost:3000/api/attachments/2663393165892092974`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth
  * Node Name: `http://localhost:3000/api/auth`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/
  * Node Name: `http://localhost:3000/api/auth/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/9074666594920310953
  * Node Name: `http://localhost:3000/api/auth/9074666594920310953`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/
  * Node Name: `http://localhost:3000/api/auth/login/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/3556517585693368879
  * Node Name: `http://localhost:3000/api/auth/login/3556517585693368879`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/me/
  * Node Name: `http://localhost:3000/api/auth/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/
  * Node Name: `http://localhost:3000/api/auth/register/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/974193626538157325
  * Node Name: `http://localhost:3000/api/auth/register/974193626538157325`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password
  * Node Name: `http://localhost:3000/api/auth/reset-password`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/
  * Node Name: `http://localhost:3000/api/auth/reset-password/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/1529359894018084807
  * Node Name: `http://localhost:3000/api/auth/reset-password/1529359894018084807`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog
  * Node Name: `http://localhost:3000/api/blog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/
  * Node Name: `http://localhost:3000/api/blog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/8339285681980221621
  * Node Name: `http://localhost:3000/api/blog/8339285681980221621`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/test
  * Node Name: `http://localhost:3000/api/blog/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/test/
  * Node Name: `http://localhost:3000/api/blog/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board
  * Node Name: `http://localhost:3000/api/board`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/
  * Node Name: `http://localhost:3000/api/board/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/6930941021494335793
  * Node Name: `http://localhost:3000/api/board/6930941021494335793`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/home
  * Node Name: `http://localhost:3000/api/board/home`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/home/
  * Node Name: `http://localhost:3000/api/board/home/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images
  * Node Name: `http://localhost:3000/api/board/images`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/
  * Node Name: `http://localhost:3000/api/board/images/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/1107155931443332263
  * Node Name: `http://localhost:3000/api/board/images/1107155931443332263`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img
  * Node Name: `http://localhost:3000/api/board/img`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/
  * Node Name: `http://localhost:3000/api/board/img/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/2487339572522887895
  * Node Name: `http://localhost:3000/api/board/img/2487339572522887895`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me
  * Node Name: `http://localhost:3000/api/board/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/
  * Node Name: `http://localhost:3000/api/board/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/4450144057723901475
  * Node Name: `http://localhost:3000/api/board/me/4450144057723901475`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/bookmarks
  * Node Name: `http://localhost:3000/api/board/me/bookmarks`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/bookmarks/
  * Node Name: `http://localhost:3000/api/board/me/bookmarks/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/likes
  * Node Name: `http://localhost:3000/api/board/me/likes`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/likes/
  * Node Name: `http://localhost:3000/api/board/me/likes/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/members
  * Node Name: `http://localhost:3000/api/board/members`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/members/
  * Node Name: `http://localhost:3000/api/board/members/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mention
  * Node Name: `http://localhost:3000/api/board/mention`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mention/
  * Node Name: `http://localhost:3000/api/board/mention/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod
  * Node Name: `http://localhost:3000/api/board/mod`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/
  * Node Name: `http://localhost:3000/api/board/mod/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/5002282826248105856
  * Node Name: `http://localhost:3000/api/board/mod/5002282826248105856`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban
  * Node Name: `http://localhost:3000/api/board/mod/ban`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/
  * Node Name: `http://localhost:3000/api/board/mod/ban/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/1681455613480455991
  * Node Name: `http://localhost:3000/api/board/mod/ban/1681455613480455991`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/bans
  * Node Name: `http://localhost:3000/api/board/mod/bans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/bans/
  * Node Name: `http://localhost:3000/api/board/mod/bans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories
  * Node Name: `http://localhost:3000/api/board/mod/categories`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/
  * Node Name: `http://localhost:3000/api/board/mod/categories/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/8544412598117917821
  * Node Name: `http://localhost:3000/api/board/mod/categories/8544412598117917821`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports
  * Node Name: `http://localhost:3000/api/board/mod/reports`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/
  * Node Name: `http://localhost:3000/api/board/mod/reports/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/2871126712386790066
  * Node Name: `http://localhost:3000/api/board/mod/reports/2871126712386790066`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts
  * Node Name: `http://localhost:3000/api/board/posts`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/
  * Node Name: `http://localhost:3000/api/board/posts/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/9175077788945764204
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/9175077788945764204`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/5516168900911045987
  * Node Name: `http://localhost:3000/api/board/posts/5516168900911045987`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/rules
  * Node Name: `http://localhost:3000/api/board/rules`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/rules/
  * Node Name: `http://localhost:3000/api/board/rules/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/search
  * Node Name: `http://localhost:3000/api/board/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/search/
  * Node Name: `http://localhost:3000/api/board/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t
  * Node Name: `http://localhost:3000/api/board/t`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/
  * Node Name: `http://localhost:3000/api/board/t/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/4717264953456883942
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/4717264953456883942`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/985710951400631045
  * Node Name: `http://localhost:3000/api/board/t/985710951400631045`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics
  * Node Name: `http://localhost:3000/api/board/topics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics/
  * Node Name: `http://localhost:3000/api/board/topics/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u
  * Node Name: `http://localhost:3000/api/board/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/
  * Node Name: `http://localhost:3000/api/board/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/4208833330492748099
  * Node Name: `http://localhost:3000/api/board/u/4208833330492748099`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/test
  * Node Name: `http://localhost:3000/api/board/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/test/
  * Node Name: `http://localhost:3000/api/board/u/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media
  * Node Name: `http://localhost:3000/api/dm-media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/
  * Node Name: `http://localhost:3000/api/dm-media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/8467235694571933949
  * Node Name: `http://localhost:3000/api/dm-media/8467235694571933949`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum
  * Node Name: `http://localhost:3000/api/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/
  * Node Name: `http://localhost:3000/api/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/4855349643712164907
  * Node Name: `http://localhost:3000/api/forum/4855349643712164907`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me
  * Node Name: `http://localhost:3000/api/forum/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/1176258764085093859
  * Node Name: `http://localhost:3000/api/forum/me/1176258764085093859`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media
  * Node Name: `http://localhost:3000/api/forum/me/media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/
  * Node Name: `http://localhost:3000/api/forum/me/media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/3621026576964250344
  * Node Name: `http://localhost:3000/api/forum/me/media/3621026576964250344`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig
  * Node Name: `http://localhost:3000/api/forum/me/media/sig`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/5699595455277479204
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/5699595455277479204`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media
  * Node Name: `http://localhost:3000/api/forum/media`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/
  * Node Name: `http://localhost:3000/api/forum/media/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/739655123197148714
  * Node Name: `http://localhost:3000/api/forum/media/739655123197148714`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/rules
  * Node Name: `http://localhost:3000/api/forum/rules`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/rules/
  * Node Name: `http://localhost:3000/api/forum/rules/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends
  * Node Name: `http://localhost:3000/api/friends`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/
  * Node Name: `http://localhost:3000/api/friends/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/5128735830827718025
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/5128735830827718025`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/1047341566068826845
  * Node Name: `http://localhost:3000/api/friends/1047341566068826845`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/search
  * Node Name: `http://localhost:3000/api/friends/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/search/
  * Node Name: `http://localhost:3000/api/friends/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/summary
  * Node Name: `http://localhost:3000/api/friends/summary`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/summary/
  * Node Name: `http://localhost:3000/api/friends/summary/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy
  * Node Name: `http://localhost:3000/api/giphy`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/
  * Node Name: `http://localhost:3000/api/giphy/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/1045742453235179043
  * Node Name: `http://localhost:3000/api/giphy/1045742453235179043`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/search
  * Node Name: `http://localhost:3000/api/giphy/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/search/
  * Node Name: `http://localhost:3000/api/giphy/search/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/status
  * Node Name: `http://localhost:3000/api/giphy/status`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/status/
  * Node Name: `http://localhost:3000/api/giphy/status/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/live
  * Node Name: `http://localhost:3000/api/live`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/live/
  * Node Name: `http://localhost:3000/api/live/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages
  * Node Name: `http://localhost:3000/api/messages`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/
  * Node Name: `http://localhost:3000/api/messages/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/123495088613168728
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/123495088613168728`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/5643837624307384963
  * Node Name: `http://localhost:3000/api/messages/5643837624307384963`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m
  * Node Name: `http://localhost:3000/api/messages/m`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/
  * Node Name: `http://localhost:3000/api/messages/m/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/7221716643910810423
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/7221716643910810423`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/3647876780698700644
  * Node Name: `http://localhost:3000/api/messages/m/3647876780698700644`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications
  * Node Name: `http://localhost:3000/api/notifications`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/
  * Node Name: `http://localhost:3000/api/notifications/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/5849755534885015137
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/5849755534885015137`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/4671884222112148903
  * Node Name: `http://localhost:3000/api/notifications/4671884222112148903`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders
  * Node Name: `http://localhost:3000/api/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/
  * Node Name: `http://localhost:3000/api/orders/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/8008798185385637598
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/8008798185385637598`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/3431385844978730100
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/3431385844978730100`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/2350574085284317914
  * Node Name: `http://localhost:3000/api/orders/2350574085284317914`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/packages
  * Node Name: `http://localhost:3000/api/packages`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/packages/
  * Node Name: `http://localhost:3000/api/packages/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plan-catalog
  * Node Name: `http://localhost:3000/api/plan-catalog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plan-catalog/
  * Node Name: `http://localhost:3000/api/plan-catalog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans
  * Node Name: `http://localhost:3000/api/plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/
  * Node Name: `http://localhost:3000/api/plans/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/2187214653167796659
  * Node Name: `http://localhost:3000/api/plans/2187214653167796659`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/overview
  * Node Name: `http://localhost:3000/api/plans/overview`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/overview/
  * Node Name: `http://localhost:3000/api/plans/overview/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress
  * Node Name: `http://localhost:3000/api/progress`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/4484465066296688521
  * Node Name: `http://localhost:3000/api/progress/4484465066296688521`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets
  * Node Name: `http://localhost:3000/api/tickets`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/
  * Node Name: `http://localhost:3000/api/tickets/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/5722093719166877205
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/5722093719166877205`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/4840022197355074997
  * Node Name: `http://localhost:3000/api/tickets/4840022197355074997`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/subjects
  * Node Name: `http://localhost:3000/api/tickets/subjects`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/subjects/
  * Node Name: `http://localhost:3000/api/tickets/subjects/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads
  * Node Name: `http://localhost:3000/api/uploads`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/
  * Node Name: `http://localhost:3000/api/uploads/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/2725548783917999162
  * Node Name: `http://localhost:3000/api/uploads/2725548783917999162`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test
  * Node Name: `http://localhost:3000/api/uploads/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test/
  * Node Name: `http://localhost:3000/api/uploads/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery ()({status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/delivery/ ()({status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001 ()({data})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/ ()({data})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close ()({confirmed})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/close/ ()({confirmed})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/activate
  * Node Name: `http://localhost:3000/api/2fa/activate ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/activate/
  * Node Name: `http://localhost:3000/api/2fa/activate/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/confirm-toggle
  * Node Name: `http://localhost:3000/api/2fa/confirm-toggle ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/confirm-toggle/
  * Node Name: `http://localhost:3000/api/2fa/confirm-toggle/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/confirm
  * Node Name: `http://localhost:3000/api/2fa/recovery/confirm ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/confirm/
  * Node Name: `http://localhost:3000/api/2fa/recovery/confirm/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/request
  * Node Name: `http://localhost:3000/api/2fa/recovery/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/recovery/request/
  * Node Name: `http://localhost:3000/api/2fa/recovery/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/activate
  * Node Name: `http://localhost:3000/api/2fa/renew/activate ()({token,renewTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/activate/
  * Node Name: `http://localhost:3000/api/2fa/renew/activate/ ()({token,renewTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/confirm
  * Node Name: `http://localhost:3000/api/2fa/renew/confirm ()({adminFactor,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/confirm/
  * Node Name: `http://localhost:3000/api/2fa/renew/confirm/ ()({adminFactor,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/request
  * Node Name: `http://localhost:3000/api/2fa/renew/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/renew/request/
  * Node Name: `http://localhost:3000/api/2fa/renew/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/request-toggle
  * Node Name: `http://localhost:3000/api/2fa/request-toggle ()({method})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/request-toggle/
  * Node Name: `http://localhost:3000/api/2fa/request-toggle/ ()({method})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/verify-totp
  * Node Name: `http://localhost:3000/api/2fa/verify-totp ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/2fa/verify-totp/
  * Node Name: `http://localhost:3000/api/2fa/verify-totp/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change
  * Node Name: `http://localhost:3000/api/account/confirm-email-change ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change-old
  * Node Name: `http://localhost:3000/api/account/confirm-email-change-old ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change-old/
  * Node Name: `http://localhost:3000/api/account/confirm-email-change-old/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-email-change/
  * Node Name: `http://localhost:3000/api/account/confirm-email-change/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-name-change/
  * Node Name: `http://localhost:3000/api/account/confirm-name-change/ ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/request
  * Node Name: `http://localhost:3000/api/account/password-reset/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/password-reset/request/
  * Node Name: `http://localhost:3000/api/account/password-reset/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-email-change
  * Node Name: `http://localhost:3000/api/account/request-email-change ()({newEmail})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-email-change/
  * Node Name: `http://localhost:3000/api/account/request-email-change/ ()({newEmail})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change
  * Node Name: `http://localhost:3000/api/account/request-name-change ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change/
  * Node Name: `http://localhost:3000/api/account/request-name-change/ ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change
  * Node Name: `http://localhost:3000/api/account/request-password-change ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change/
  * Node Name: `http://localhost:3000/api/account/request-password-change/ ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code
  * Node Name: `http://localhost:3000/api/account/resend-code ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code/
  * Node Name: `http://localhost:3000/api/account/resend-code/ ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban ()({hours})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/ban/ ()({hours})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/unblock/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve ()({reason,paymentRef,kinds})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve/
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/approve/ ()({reason,paymentRef,kinds})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans
  * Node Name: `http://localhost:3000/api/admin/plans ()({data,memberId,kind})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/
  * Node Name: `http://localhost:3000/api/admin/plans/ ()({data,memberId,kind})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/publish/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/unpublish/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/reply/ ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/forgot-password
  * Node Name: `http://localhost:3000/api/auth/forgot-password ()({identifier,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/forgot-password/
  * Node Name: `http://localhost:3000/api/auth/forgot-password/ ()({identifier,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({identifier,password,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/
  * Node Name: `http://localhost:3000/api/auth/login/ ()({identifier,password,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/verify-totp
  * Node Name: `http://localhost:3000/api/auth/login/verify-totp ()({userId,token,recoveryCode,loginTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/verify-totp/
  * Node Name: `http://localhost:3000/api/auth/login/verify-totp/ ()({userId,token,recoveryCode,loginTicket})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({fullName,username,email,password,recaptchaToken,kvkkAccepted,aboutAccepted})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/
  * Node Name: `http://localhost:3000/api/auth/register/ ()({fullName,username,email,password,recaptchaToken,kvkkAccepted,aboutAccepted})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/resend
  * Node Name: `http://localhost:3000/api/auth/register/resend ()({userId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/resend/
  * Node Name: `http://localhost:3000/api/auth/register/resend/ ()({userId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/verify
  * Node Name: `http://localhost:3000/api/auth/register/verify ()({userId,code,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/verify/
  * Node Name: `http://localhost:3000/api/auth/register/verify/ ()({userId,code,recaptchaToken})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password
  * Node Name: `http://localhost:3000/api/auth/reset-password ()({ticket,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/
  * Node Name: `http://localhost:3000/api/auth/reset-password/ ()({ticket,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/link
  * Node Name: `http://localhost:3000/api/auth/reset-password/link ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/link/
  * Node Name: `http://localhost:3000/api/auth/reset-password/link/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/resend
  * Node Name: `http://localhost:3000/api/auth/reset-password/resend ()({resetId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/resend/
  * Node Name: `http://localhost:3000/api/auth/reset-password/resend/ ()({resetId})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/verify
  * Node Name: `http://localhost:3000/api/auth/reset-password/verify ()({resetId,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/reset-password/verify/
  * Node Name: `http://localhost:3000/api/auth/reset-password/verify/ ()({resetId,code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images
  * Node Name: `http://localhost:3000/api/board/images ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/
  * Node Name: `http://localhost:3000/api/board/images/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/giphy
  * Node Name: `http://localhost:3000/api/board/images/giphy ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/images/giphy/
  * Node Name: `http://localhost:3000/api/board/images/giphy/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test
  * Node Name: `http://localhost:3000/api/board/mod/ban/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/ban/test/
  * Node Name: `http://localhost:3000/api/board/mod/ban/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/bookmark/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/react/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/report/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/read-all
  * Node Name: `http://localhost:3000/api/board/read-all ()({category})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/read-all/
  * Node Name: `http://localhost:3000/api/board/read-all/ ()({category})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/mod/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/read-all/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/watch/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics
  * Node Name: `http://localhost:3000/api/board/topics ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics/
  * Node Name: `http://localhost:3000/api/board/topics/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/giphy
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/giphy ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/sig/giphy/
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/giphy/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test
  * Node Name: `http://localhost:3000/api/forum/me/media/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/media/test/
  * Node Name: `http://localhost:3000/api/forum/me/media/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/accept/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/request
  * Node Name: `http://localhost:3000/api/friends/request ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/request/
  * Node Name: `http://localhost:3000/api/friends/request/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/typing/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read/
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/read/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/read-all
  * Node Name: `http://localhost:3000/api/notifications/read-all ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/read-all/
  * Node Name: `http://localhost:3000/api/notifications/read-all/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders
  * Node Name: `http://localhost:3000/api/orders ()({packageKey,weeks,consent})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/
  * Node Name: `http://localhost:3000/api/orders/ ()({packageKey,weeks,consent})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/cancel/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock ()({outcome})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/mock/ ()({outcome})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress
  * Node Name: `http://localhost:3000/api/progress ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets
  * Node Name: `http://localhost:3000/api/tickets ()({planKind,attachments,title,subject,message})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/
  * Node Name: `http://localhost:3000/api/tickets/ ()({planKind,attachments,title,subject,message})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/messages/ ()({message,attachments})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test
  * Node Name: `http://localhost:3000/api/uploads/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test/
  * Node Name: `http://localhost:3000/api/uploads/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/computeMetadata/v1/
  * Node Name: `http://localhost:3000/computeMetadata/v1/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/latest/meta-data/
  * Node Name: `http://localhost:3000/latest/meta-data/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/metadata/instance
  * Node Name: `http://localhost:3000/metadata/instance ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/metadata/v1
  * Node Name: `http://localhost:3000/metadata/v1 ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/opc/v1/instance/
  * Node Name: `http://localhost:3000/opc/v1/instance/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/opc/v2/instance/
  * Node Name: `http://localhost:3000/opc/v2/instance/ ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/openstack/latest/meta_data.json
  * Node Name: `http://localhost:3000/openstack/latest/meta_data.json ()({token})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments
  * Node Name: `http://localhost:3000/api/admin/assignments ()({delivery,coachId,memberId})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/assignments/
  * Node Name: `http://localhost:3000/api/admin/assignments/ ()({delivery,coachId,memberId})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access ()({kinds})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/access/ ()({kinds})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role ()({planKinds,role})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role/
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/role/ ()({planKinds,role})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me
  * Node Name: `http://localhost:3000/api/forum/me ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/username
  * Node Name: `http://localhost:3000/api/forum/me/username ()({username,password})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/username/
  * Node Name: `http://localhost:3000/api/forum/me/username/ ()({username,password})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile
  * Node Name: `http://localhost:3000/api/profile ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``


Instances: 501

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Non-Storable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are not storable by caching components such as proxy servers. If the response does not contain sensitive, personal or user-specific information, it may benefit from being stored and cached, to improve performance.

* URL: http://localhost:3000/api/account/login-history
  * Node Name: `http://localhost:3000/api/account/login-history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change
  * Node Name: `http://localhost:3000/api/account/request-name-change ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change
  * Node Name: `http://localhost:3000/api/account/request-password-change ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code
  * Node Name: `http://localhost:3000/api/account/resend-code ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``

Instances: Systemic


### Solution

The content may be marked as storable by ensuring that the following conditions are satisfied:
The request method must be understood by the cache and defined as being cacheable ("GET", "HEAD", and "POST" are currently defined as cacheable)
The response status code must be understood by the cache (one of the 1XX, 2XX, 3XX, 4XX, or 5XX response classes are generally understood)
The "no-store" cache directive must not appear in the request or response header fields
For caching by "shared" caches such as "proxy" caches, the "private" response directive must not appear in the response
For caching by "shared" caches such as "proxy" caches, the "Authorization" header field must not appear in the request, unless the response explicitly allows it (using one of the "must-revalidate", "public", or "s-maxage" Cache-Control response directives)
In addition to the conditions above, at least one of the following conditions must also be satisfied by the response:
It must contain an "Expires" header field
It must contain a "max-age" response directive
For "shared" caches such as "proxy" caches, it must contain a "s-maxage" response directive
It must contain a "Cache Control Extension" that allows it to be cached
It must have a status code that is defined as cacheable by default (200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501).

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3



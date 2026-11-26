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
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method GET | 60 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PATCH | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method POST | 28 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PUT | 3 % |
| Info | Informational | http://localhost:3000 | Count of total endpoints | 602    |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: style-src unsafe-inline | Medium | Systemic |
| Unexpected Content-Type was returned | Low | 601 |
| A Client Error response code was returned by the server | Informational | 599 |
| Non-Storable Content | Informational | Systemic |




## Alert Detail



### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
  * Method: `POST`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none';frame-ancestors 'none';base-uri 'none';form-action 'self';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'unsafe-inline';img-src 'self' data:;upgrade-insecure-requests`
  * Other Info: `style-src includes unsafe-inline.`
* URL: http://localhost:3000/api/account/request-email-change
  * Node Name: `http://localhost:3000/api/account/request-email-change ()({newEmail})`
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
* URL: http://localhost:3000/api/assistant/messages
  * Node Name: `http://localhost:3000/api/assistant/messages`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages/
  * Node Name: `http://localhost:3000/api/assistant/messages/`
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
* URL: http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/5665529852582711725
  * Node Name: `http://localhost:3000/5665529852582711725`
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
* URL: http://localhost:3000/api/2fa/2600485925672874
  * Node Name: `http://localhost:3000/api/2fa/2600485925672874`
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
* URL: http://localhost:3000/api/2fa/recovery/3729123252451594534
  * Node Name: `http://localhost:3000/api/2fa/recovery/3729123252451594534`
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
* URL: http://localhost:3000/api/2fa/renew/4160971424327537711
  * Node Name: `http://localhost:3000/api/2fa/renew/4160971424327537711`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/5633943332188732721
  * Node Name: `http://localhost:3000/api/5633943332188732721`
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
* URL: http://localhost:3000/api/account/2551777073938242382
  * Node Name: `http://localhost:3000/api/account/2551777073938242382`
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
* URL: http://localhost:3000/api/account/password-reset/8258863134372360304
  * Node Name: `http://localhost:3000/api/account/password-reset/8258863134372360304`
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
* URL: http://localhost:3000/api/admin/7982773654725924646
  * Node Name: `http://localhost:3000/api/admin/7982773654725924646`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/analytics
  * Node Name: `http://localhost:3000/api/admin/analytics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/analytics/
  * Node Name: `http://localhost:3000/api/admin/analytics/`
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
* URL: http://localhost:3000/api/admin/attachments/3847907596615666996
  * Node Name: `http://localhost:3000/api/admin/attachments/3847907596615666996`
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
* URL: http://localhost:3000/api/admin/audit/451423445129390399
  * Node Name: `http://localhost:3000/api/admin/audit/451423445129390399`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/4103096916183542511
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/4103096916183542511`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal/`
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
* URL: http://localhost:3000/api/admin/clients/7561724508508291219
  * Node Name: `http://localhost:3000/api/admin/clients/7561724508508291219`
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
* URL: http://localhost:3000/api/admin/dm-media/5820991778007023795
  * Node Name: `http://localhost:3000/api/admin/dm-media/5820991778007023795`
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
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8504289225874178388
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8504289225874178388`
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
* URL: http://localhost:3000/api/admin/dm-reports/540081406314622672
  * Node Name: `http://localhost:3000/api/admin/dm-reports/540081406314622672`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/due-plans
  * Node Name: `http://localhost:3000/api/admin/due-plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/due-plans/
  * Node Name: `http://localhost:3000/api/admin/due-plans/`
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
* URL: http://localhost:3000/api/admin/forum/7292998012537918788
  * Node Name: `http://localhost:3000/api/admin/forum/7292998012537918788`
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
* URL: http://localhost:3000/api/admin/forum/metrics
  * Node Name: `http://localhost:3000/api/admin/forum/metrics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/metrics/
  * Node Name: `http://localhost:3000/api/admin/forum/metrics/`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/7792226995713371496
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/7792226995713371496`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/8165923441219202935
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/8165923441219202935`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/7937067354973212077
  * Node Name: `http://localhost:3000/api/admin/members/7937067354973212077`
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
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/7555989619539904724
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/7555989619539904724`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/6656328874387539003
  * Node Name: `http://localhost:3000/api/admin/orders/6656328874387539003`
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
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1716032738073441242
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1716032738073441242`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/417113881554728845
  * Node Name: `http://localhost:3000/api/admin/plans/417113881554728845`
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
* URL: http://localhost:3000/api/admin/support/4101593064824615799
  * Node Name: `http://localhost:3000/api/admin/support/4101593064824615799`
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
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/7790590220952127395
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/7790590220952127395`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/6950828503526462053
  * Node Name: `http://localhost:3000/api/admin/tickets/6950828503526462053`
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
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/3316752592209498729
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/3316752592209498729`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/6747806000984385679
  * Node Name: `http://localhost:3000/api/admin/users/6747806000984385679`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics
  * Node Name: `http://localhost:3000/api/analytics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/
  * Node Name: `http://localhost:3000/api/analytics/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/5755238818817080777
  * Node Name: `http://localhost:3000/api/analytics/5755238818817080777`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant
  * Node Name: `http://localhost:3000/api/assistant`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/
  * Node Name: `http://localhost:3000/api/assistant/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/4123361265185041173
  * Node Name: `http://localhost:3000/api/assistant/4123361265185041173`
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
* URL: http://localhost:3000/api/attachments/1714897485119069599
  * Node Name: `http://localhost:3000/api/attachments/1714897485119069599`
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
* URL: http://localhost:3000/api/auth/8972765610576548158
  * Node Name: `http://localhost:3000/api/auth/8972765610576548158`
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
* URL: http://localhost:3000/api/auth/login/1179880945440422469
  * Node Name: `http://localhost:3000/api/auth/login/1179880945440422469`
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
* URL: http://localhost:3000/api/auth/register/119674062087832204
  * Node Name: `http://localhost:3000/api/auth/register/119674062087832204`
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
* URL: http://localhost:3000/api/auth/reset-password/6076099398513307731
  * Node Name: `http://localhost:3000/api/auth/reset-password/6076099398513307731`
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
* URL: http://localhost:3000/api/blog/1745938298227860765
  * Node Name: `http://localhost:3000/api/blog/1745938298227860765`
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
* URL: http://localhost:3000/api/board/7919830974604088183
  * Node Name: `http://localhost:3000/api/board/7919830974604088183`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge
  * Node Name: `http://localhost:3000/api/board/challenge`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/
  * Node Name: `http://localhost:3000/api/board/challenge/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/4849561603888938826
  * Node Name: `http://localhost:3000/api/board/challenge/4849561603888938826`
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
* URL: http://localhost:3000/api/board/images/9145085843563872610
  * Node Name: `http://localhost:3000/api/board/images/9145085843563872610`
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
* URL: http://localhost:3000/api/board/img/7713000652194370600
  * Node Name: `http://localhost:3000/api/board/img/7713000652194370600`
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
* URL: http://localhost:3000/api/board/me/1222833069560492151
  * Node Name: `http://localhost:3000/api/board/me/1222833069560492151`
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
* URL: http://localhost:3000/api/board/mod/1328365168773955107
  * Node Name: `http://localhost:3000/api/board/mod/1328365168773955107`
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
* URL: http://localhost:3000/api/board/mod/ban/4434272465103461245
  * Node Name: `http://localhost:3000/api/board/mod/ban/4434272465103461245`
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
* URL: http://localhost:3000/api/board/mod/categories/82149767616788021
  * Node Name: `http://localhost:3000/api/board/mod/categories/82149767616788021`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/log
  * Node Name: `http://localhost:3000/api/board/mod/log`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/log/
  * Node Name: `http://localhost:3000/api/board/mod/log/`
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
* URL: http://localhost:3000/api/board/mod/reports/6389032432181579211
  * Node Name: `http://localhost:3000/api/board/mod/reports/6389032432181579211`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u
  * Node Name: `http://localhost:3000/api/board/mod/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/
  * Node Name: `http://localhost:3000/api/board/mod/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/5686984910034165377
  * Node Name: `http://localhost:3000/api/board/mod/u/5686984910034165377`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test
  * Node Name: `http://localhost:3000/api/board/mod/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/
  * Node Name: `http://localhost:3000/api/board/mod/u/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/7395254833828606900
  * Node Name: `http://localhost:3000/api/board/mod/u/test/7395254833828606900`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/content
  * Node Name: `http://localhost:3000/api/board/mod/u/test/content`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/content/
  * Node Name: `http://localhost:3000/api/board/mod/u/test/content/`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/203452877076577380
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/203452877076577380`
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
* URL: http://localhost:3000/api/board/posts/8958138236758389179
  * Node Name: `http://localhost:3000/api/board/posts/8958138236758389179`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public
  * Node Name: `http://localhost:3000/api/board/public`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/
  * Node Name: `http://localhost:3000/api/board/public/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/4468366627834902766
  * Node Name: `http://localhost:3000/api/board/public/4468366627834902766`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/home
  * Node Name: `http://localhost:3000/api/board/public/home`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/home/
  * Node Name: `http://localhost:3000/api/board/public/home/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img
  * Node Name: `http://localhost:3000/api/board/public/img`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/
  * Node Name: `http://localhost:3000/api/board/public/img/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/7410062246829137671
  * Node Name: `http://localhost:3000/api/board/public/img/7410062246829137671`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t
  * Node Name: `http://localhost:3000/api/board/public/t`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/
  * Node Name: `http://localhost:3000/api/board/public/t/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/8776362979722855980
  * Node Name: `http://localhost:3000/api/board/public/t/8776362979722855980`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/topics
  * Node Name: `http://localhost:3000/api/board/public/topics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/topics/
  * Node Name: `http://localhost:3000/api/board/public/topics/`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/9077039925236750400
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/9077039925236750400`
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
* URL: http://localhost:3000/api/board/t/7277463451746945530
  * Node Name: `http://localhost:3000/api/board/t/7277463451746945530`
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
* URL: http://localhost:3000/api/board/u/9094339587441443650
  * Node Name: `http://localhost:3000/api/board/u/9094339587441443650`
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
* URL: http://localhost:3000/api/dm-media/5500215688701182274
  * Node Name: `http://localhost:3000/api/dm-media/5500215688701182274`
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
* URL: http://localhost:3000/api/forum/3602174384927206988
  * Node Name: `http://localhost:3000/api/forum/3602174384927206988`
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
* URL: http://localhost:3000/api/forum/me/5099073787146480888
  * Node Name: `http://localhost:3000/api/forum/me/5099073787146480888`
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
* URL: http://localhost:3000/api/forum/me/media/8678029870934106073
  * Node Name: `http://localhost:3000/api/forum/me/media/8678029870934106073`
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
* URL: http://localhost:3000/api/forum/me/media/sig/3929981850178367066
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/3929981850178367066`
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
* URL: http://localhost:3000/api/forum/media/3898487332850287984
  * Node Name: `http://localhost:3000/api/forum/media/3898487332850287984`
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
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/6598316943504945900
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/6598316943504945900`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/7470955101602627193
  * Node Name: `http://localhost:3000/api/friends/7470955101602627193`
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
* URL: http://localhost:3000/api/giphy/1079803154896487600
  * Node Name: `http://localhost:3000/api/giphy/1079803154896487600`
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
* URL: http://localhost:3000/api/journal
  * Node Name: `http://localhost:3000/api/journal`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/
  * Node Name: `http://localhost:3000/api/journal/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/6578799580069470128
  * Node Name: `http://localhost:3000/api/journal/6578799580069470128`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries
  * Node Name: `http://localhost:3000/api/journal/entries`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/
  * Node Name: `http://localhost:3000/api/journal/entries/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/5752124123849990516
  * Node Name: `http://localhost:3000/api/journal/entries/5752124123849990516`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos
  * Node Name: `http://localhost:3000/api/journal/photos`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/
  * Node Name: `http://localhost:3000/api/journal/photos/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/228152441833145433
  * Node Name: `http://localhost:3000/api/journal/photos/228152441833145433`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u
  * Node Name: `http://localhost:3000/api/journal/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/
  * Node Name: `http://localhost:3000/api/journal/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/8163558500524092521
  * Node Name: `http://localhost:3000/api/journal/u/8163558500524092521`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/test
  * Node Name: `http://localhost:3000/api/journal/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/test/
  * Node Name: `http://localhost:3000/api/journal/u/test/`
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
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/2753394687312643164
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/2753394687312643164`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/4379716215556806658
  * Node Name: `http://localhost:3000/api/messages/4379716215556806658`
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
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/4605016637587025748
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/4605016637587025748`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/2207311844765917105
  * Node Name: `http://localhost:3000/api/messages/m/2207311844765917105`
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
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/1437262035644224635
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/1437262035644224635`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/1969704659738092642
  * Node Name: `http://localhost:3000/api/notifications/1969704659738092642`
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
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/3679796320530729247
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/3679796320530729247`
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
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/7792596153370839694
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/7792596153370839694`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/8774249893611699884
  * Node Name: `http://localhost:3000/api/orders/8774249893611699884`
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
* URL: http://localhost:3000/api/plans/3742068247150909092
  * Node Name: `http://localhost:3000/api/plans/3742068247150909092`
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
* URL: http://localhost:3000/api/progress/5027298725413751369
  * Node Name: `http://localhost:3000/api/progress/5027298725413751369`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push
  * Node Name: `http://localhost:3000/api/push`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/
  * Node Name: `http://localhost:3000/api/push/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/7964280233829786455
  * Node Name: `http://localhost:3000/api/push/7964280233829786455`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/key
  * Node Name: `http://localhost:3000/api/push/key`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/key/
  * Node Name: `http://localhost:3000/api/push/key/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/latest
  * Node Name: `http://localhost:3000/api/push/latest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/latest/
  * Node Name: `http://localhost:3000/api/push/latest/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/status
  * Node Name: `http://localhost:3000/api/push/status`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/status/
  * Node Name: `http://localhost:3000/api/push/status/`
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
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/1437146541079849942
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/1437146541079849942`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/2063185344188991917
  * Node Name: `http://localhost:3000/api/tickets/2063185344188991917`
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
* URL: http://localhost:3000/api/uploads/6591080036551372050
  * Node Name: `http://localhost:3000/api/uploads/6591080036551372050`
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
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/ ()({})`
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
* URL: http://localhost:3000/api/analytics/event
  * Node Name: `http://localhost:3000/api/analytics/event ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/event/
  * Node Name: `http://localhost:3000/api/analytics/event/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/hit/
  * Node Name: `http://localhost:3000/api/analytics/hit/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/consent
  * Node Name: `http://localhost:3000/api/assistant/consent ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/consent/
  * Node Name: `http://localhost:3000/api/assistant/consent/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages
  * Node Name: `http://localhost:3000/api/assistant/messages ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages/
  * Node Name: `http://localhost:3000/api/assistant/messages/ ()({})`
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
* URL: http://localhost:3000/api/board/challenge/checkin
  * Node Name: `http://localhost:3000/api/board/challenge/checkin ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/checkin/
  * Node Name: `http://localhost:3000/api/board/challenge/checkin/ ()({})`
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
* URL: http://localhost:3000/api/journal/photos
  * Node Name: `http://localhost:3000/api/journal/photos ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/
  * Node Name: `http://localhost:3000/api/journal/photos/ ()({})`
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
* URL: http://localhost:3000/api/push/subscribe
  * Node Name: `http://localhost:3000/api/push/subscribe ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/subscribe/
  * Node Name: `http://localhost:3000/api/push/subscribe/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/test
  * Node Name: `http://localhost:3000/api/push/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/test/
  * Node Name: `http://localhost:3000/api/push/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/unsubscribe
  * Node Name: `http://localhost:3000/api/push/unsubscribe ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/push/unsubscribe/
  * Node Name: `http://localhost:3000/api/push/unsubscribe/ ()({})`
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
* URL: http://localhost:3000/api/journal/entries
  * Node Name: `http://localhost:3000/api/journal/entries ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/
  * Node Name: `http://localhost:3000/api/journal/entries/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/share
  * Node Name: `http://localhost:3000/api/journal/share ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/share/
  * Node Name: `http://localhost:3000/api/journal/share/ ()({})`
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


Instances: 601

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
* URL: http://localhost:3000/api/assistant/messages
  * Node Name: `http://localhost:3000/api/assistant/messages`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages/
  * Node Name: `http://localhost:3000/api/assistant/messages/`
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
* URL: http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/entries/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/5665529852582711725
  * Node Name: `http://localhost:3000/5665529852582711725`
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
* URL: http://localhost:3000/api/2fa/2600485925672874
  * Node Name: `http://localhost:3000/api/2fa/2600485925672874`
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
* URL: http://localhost:3000/api/2fa/recovery/3729123252451594534
  * Node Name: `http://localhost:3000/api/2fa/recovery/3729123252451594534`
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
* URL: http://localhost:3000/api/2fa/renew/4160971424327537711
  * Node Name: `http://localhost:3000/api/2fa/renew/4160971424327537711`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/5633943332188732721
  * Node Name: `http://localhost:3000/api/5633943332188732721`
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
* URL: http://localhost:3000/api/account/2551777073938242382
  * Node Name: `http://localhost:3000/api/account/2551777073938242382`
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
* URL: http://localhost:3000/api/account/password-reset/8258863134372360304
  * Node Name: `http://localhost:3000/api/account/password-reset/8258863134372360304`
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
* URL: http://localhost:3000/api/admin/7982773654725924646
  * Node Name: `http://localhost:3000/api/admin/7982773654725924646`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/analytics
  * Node Name: `http://localhost:3000/api/admin/analytics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/analytics/
  * Node Name: `http://localhost:3000/api/admin/analytics/`
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
* URL: http://localhost:3000/api/admin/attachments/3847907596615666996
  * Node Name: `http://localhost:3000/api/admin/attachments/3847907596615666996`
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
* URL: http://localhost:3000/api/admin/audit/451423445129390399
  * Node Name: `http://localhost:3000/api/admin/audit/451423445129390399`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/4103096916183542511
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/4103096916183542511`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/journal/`
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
* URL: http://localhost:3000/api/admin/clients/7561724508508291219
  * Node Name: `http://localhost:3000/api/admin/clients/7561724508508291219`
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
* URL: http://localhost:3000/api/admin/dm-media/5820991778007023795
  * Node Name: `http://localhost:3000/api/admin/dm-media/5820991778007023795`
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
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8504289225874178388
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/8504289225874178388`
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
* URL: http://localhost:3000/api/admin/dm-reports/540081406314622672
  * Node Name: `http://localhost:3000/api/admin/dm-reports/540081406314622672`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/due-plans
  * Node Name: `http://localhost:3000/api/admin/due-plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/due-plans/
  * Node Name: `http://localhost:3000/api/admin/due-plans/`
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
* URL: http://localhost:3000/api/admin/forum/7292998012537918788
  * Node Name: `http://localhost:3000/api/admin/forum/7292998012537918788`
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
* URL: http://localhost:3000/api/admin/forum/metrics
  * Node Name: `http://localhost:3000/api/admin/forum/metrics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/metrics/
  * Node Name: `http://localhost:3000/api/admin/forum/metrics/`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/7792226995713371496
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/7792226995713371496`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/8165923441219202935
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/8165923441219202935`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/7937067354973212077
  * Node Name: `http://localhost:3000/api/admin/members/7937067354973212077`
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
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/7555989619539904724
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/7555989619539904724`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/6656328874387539003
  * Node Name: `http://localhost:3000/api/admin/orders/6656328874387539003`
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
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1716032738073441242
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1716032738073441242`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/417113881554728845
  * Node Name: `http://localhost:3000/api/admin/plans/417113881554728845`
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
* URL: http://localhost:3000/api/admin/support/4101593064824615799
  * Node Name: `http://localhost:3000/api/admin/support/4101593064824615799`
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
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/7790590220952127395
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/7790590220952127395`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/6950828503526462053
  * Node Name: `http://localhost:3000/api/admin/tickets/6950828503526462053`
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
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/3316752592209498729
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/3316752592209498729`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/6747806000984385679
  * Node Name: `http://localhost:3000/api/admin/users/6747806000984385679`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics
  * Node Name: `http://localhost:3000/api/analytics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/
  * Node Name: `http://localhost:3000/api/analytics/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/5755238818817080777
  * Node Name: `http://localhost:3000/api/analytics/5755238818817080777`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant
  * Node Name: `http://localhost:3000/api/assistant`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/
  * Node Name: `http://localhost:3000/api/assistant/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/4123361265185041173
  * Node Name: `http://localhost:3000/api/assistant/4123361265185041173`
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
* URL: http://localhost:3000/api/attachments/1714897485119069599
  * Node Name: `http://localhost:3000/api/attachments/1714897485119069599`
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
* URL: http://localhost:3000/api/auth/8972765610576548158
  * Node Name: `http://localhost:3000/api/auth/8972765610576548158`
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
* URL: http://localhost:3000/api/auth/login/1179880945440422469
  * Node Name: `http://localhost:3000/api/auth/login/1179880945440422469`
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
* URL: http://localhost:3000/api/auth/register/119674062087832204
  * Node Name: `http://localhost:3000/api/auth/register/119674062087832204`
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
* URL: http://localhost:3000/api/auth/reset-password/6076099398513307731
  * Node Name: `http://localhost:3000/api/auth/reset-password/6076099398513307731`
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
* URL: http://localhost:3000/api/blog/1745938298227860765
  * Node Name: `http://localhost:3000/api/blog/1745938298227860765`
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
* URL: http://localhost:3000/api/board/7919830974604088183
  * Node Name: `http://localhost:3000/api/board/7919830974604088183`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge
  * Node Name: `http://localhost:3000/api/board/challenge`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/
  * Node Name: `http://localhost:3000/api/board/challenge/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/4849561603888938826
  * Node Name: `http://localhost:3000/api/board/challenge/4849561603888938826`
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
* URL: http://localhost:3000/api/board/images/9145085843563872610
  * Node Name: `http://localhost:3000/api/board/images/9145085843563872610`
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
* URL: http://localhost:3000/api/board/img/7713000652194370600
  * Node Name: `http://localhost:3000/api/board/img/7713000652194370600`
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
* URL: http://localhost:3000/api/board/me/1222833069560492151
  * Node Name: `http://localhost:3000/api/board/me/1222833069560492151`
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
* URL: http://localhost:3000/api/board/mod/1328365168773955107
  * Node Name: `http://localhost:3000/api/board/mod/1328365168773955107`
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
* URL: http://localhost:3000/api/board/mod/ban/4434272465103461245
  * Node Name: `http://localhost:3000/api/board/mod/ban/4434272465103461245`
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
* URL: http://localhost:3000/api/board/mod/categories/82149767616788021
  * Node Name: `http://localhost:3000/api/board/mod/categories/82149767616788021`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/log
  * Node Name: `http://localhost:3000/api/board/mod/log`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/log/
  * Node Name: `http://localhost:3000/api/board/mod/log/`
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
* URL: http://localhost:3000/api/board/mod/reports/6389032432181579211
  * Node Name: `http://localhost:3000/api/board/mod/reports/6389032432181579211`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u
  * Node Name: `http://localhost:3000/api/board/mod/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/
  * Node Name: `http://localhost:3000/api/board/mod/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/5686984910034165377
  * Node Name: `http://localhost:3000/api/board/mod/u/5686984910034165377`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test
  * Node Name: `http://localhost:3000/api/board/mod/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/
  * Node Name: `http://localhost:3000/api/board/mod/u/test/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/7395254833828606900
  * Node Name: `http://localhost:3000/api/board/mod/u/test/7395254833828606900`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/content
  * Node Name: `http://localhost:3000/api/board/mod/u/test/content`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/content/
  * Node Name: `http://localhost:3000/api/board/mod/u/test/content/`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/203452877076577380
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/203452877076577380`
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
* URL: http://localhost:3000/api/board/posts/8958138236758389179
  * Node Name: `http://localhost:3000/api/board/posts/8958138236758389179`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public
  * Node Name: `http://localhost:3000/api/board/public`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/
  * Node Name: `http://localhost:3000/api/board/public/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/4468366627834902766
  * Node Name: `http://localhost:3000/api/board/public/4468366627834902766`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/home
  * Node Name: `http://localhost:3000/api/board/public/home`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/home/
  * Node Name: `http://localhost:3000/api/board/public/home/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img
  * Node Name: `http://localhost:3000/api/board/public/img`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/
  * Node Name: `http://localhost:3000/api/board/public/img/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/7410062246829137671
  * Node Name: `http://localhost:3000/api/board/public/img/7410062246829137671`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t
  * Node Name: `http://localhost:3000/api/board/public/t`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/
  * Node Name: `http://localhost:3000/api/board/public/t/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/8776362979722855980
  * Node Name: `http://localhost:3000/api/board/public/t/8776362979722855980`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/topics
  * Node Name: `http://localhost:3000/api/board/public/topics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/topics/
  * Node Name: `http://localhost:3000/api/board/public/topics/`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/9077039925236750400
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/9077039925236750400`
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
* URL: http://localhost:3000/api/board/t/7277463451746945530
  * Node Name: `http://localhost:3000/api/board/t/7277463451746945530`
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
* URL: http://localhost:3000/api/board/u/9094339587441443650
  * Node Name: `http://localhost:3000/api/board/u/9094339587441443650`
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
* URL: http://localhost:3000/api/dm-media/5500215688701182274
  * Node Name: `http://localhost:3000/api/dm-media/5500215688701182274`
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
* URL: http://localhost:3000/api/forum/3602174384927206988
  * Node Name: `http://localhost:3000/api/forum/3602174384927206988`
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
* URL: http://localhost:3000/api/forum/me/5099073787146480888
  * Node Name: `http://localhost:3000/api/forum/me/5099073787146480888`
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
* URL: http://localhost:3000/api/forum/me/media/8678029870934106073
  * Node Name: `http://localhost:3000/api/forum/me/media/8678029870934106073`
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
* URL: http://localhost:3000/api/forum/me/media/sig/3929981850178367066
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/3929981850178367066`
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
* URL: http://localhost:3000/api/forum/media/3898487332850287984
  * Node Name: `http://localhost:3000/api/forum/media/3898487332850287984`
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
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/6598316943504945900
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/6598316943504945900`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/7470955101602627193
  * Node Name: `http://localhost:3000/api/friends/7470955101602627193`
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
* URL: http://localhost:3000/api/giphy/1079803154896487600
  * Node Name: `http://localhost:3000/api/giphy/1079803154896487600`
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
* URL: http://localhost:3000/api/journal
  * Node Name: `http://localhost:3000/api/journal`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/
  * Node Name: `http://localhost:3000/api/journal/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/6578799580069470128
  * Node Name: `http://localhost:3000/api/journal/6578799580069470128`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries
  * Node Name: `http://localhost:3000/api/journal/entries`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/
  * Node Name: `http://localhost:3000/api/journal/entries/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/5752124123849990516
  * Node Name: `http://localhost:3000/api/journal/entries/5752124123849990516`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos
  * Node Name: `http://localhost:3000/api/journal/photos`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/
  * Node Name: `http://localhost:3000/api/journal/photos/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/228152441833145433
  * Node Name: `http://localhost:3000/api/journal/photos/228152441833145433`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u
  * Node Name: `http://localhost:3000/api/journal/u`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/
  * Node Name: `http://localhost:3000/api/journal/u/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/8163558500524092521
  * Node Name: `http://localhost:3000/api/journal/u/8163558500524092521`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/test
  * Node Name: `http://localhost:3000/api/journal/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/test/
  * Node Name: `http://localhost:3000/api/journal/u/test/`
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
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/2753394687312643164
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/2753394687312643164`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/4379716215556806658
  * Node Name: `http://localhost:3000/api/messages/4379716215556806658`
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
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/4605016637587025748
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/4605016637587025748`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/2207311844765917105
  * Node Name: `http://localhost:3000/api/messages/m/2207311844765917105`
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
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/1437262035644224635
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/1437262035644224635`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/1969704659738092642
  * Node Name: `http://localhost:3000/api/notifications/1969704659738092642`
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
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/3679796320530729247
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/3679796320530729247`
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
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/7792596153370839694
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/7792596153370839694`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/8774249893611699884
  * Node Name: `http://localhost:3000/api/orders/8774249893611699884`
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
* URL: http://localhost:3000/api/plans/3742068247150909092
  * Node Name: `http://localhost:3000/api/plans/3742068247150909092`
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
* URL: http://localhost:3000/api/progress/5027298725413751369
  * Node Name: `http://localhost:3000/api/progress/5027298725413751369`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push
  * Node Name: `http://localhost:3000/api/push`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/
  * Node Name: `http://localhost:3000/api/push/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/7964280233829786455
  * Node Name: `http://localhost:3000/api/push/7964280233829786455`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/key
  * Node Name: `http://localhost:3000/api/push/key`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/key/
  * Node Name: `http://localhost:3000/api/push/key/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/latest
  * Node Name: `http://localhost:3000/api/push/latest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/latest/
  * Node Name: `http://localhost:3000/api/push/latest/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/status
  * Node Name: `http://localhost:3000/api/push/status`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/status/
  * Node Name: `http://localhost:3000/api/push/status/`
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
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/1437146541079849942
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/1437146541079849942`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/2063185344188991917
  * Node Name: `http://localhost:3000/api/tickets/2063185344188991917`
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
* URL: http://localhost:3000/api/uploads/6591080036551372050
  * Node Name: `http://localhost:3000/api/uploads/6591080036551372050`
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
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001 ()({})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/ ()({})`
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
* URL: http://localhost:3000/api/analytics/event
  * Node Name: `http://localhost:3000/api/analytics/event ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/event/
  * Node Name: `http://localhost:3000/api/analytics/event/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/hit/
  * Node Name: `http://localhost:3000/api/analytics/hit/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/consent
  * Node Name: `http://localhost:3000/api/assistant/consent ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/consent/
  * Node Name: `http://localhost:3000/api/assistant/consent/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages
  * Node Name: `http://localhost:3000/api/assistant/messages ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/messages/
  * Node Name: `http://localhost:3000/api/assistant/messages/ ()({})`
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
* URL: http://localhost:3000/api/board/challenge/checkin
  * Node Name: `http://localhost:3000/api/board/challenge/checkin ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/checkin/
  * Node Name: `http://localhost:3000/api/board/challenge/checkin/ ()({})`
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
* URL: http://localhost:3000/api/journal/photos
  * Node Name: `http://localhost:3000/api/journal/photos ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/
  * Node Name: `http://localhost:3000/api/journal/photos/ ()({})`
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
* URL: http://localhost:3000/api/push/subscribe
  * Node Name: `http://localhost:3000/api/push/subscribe ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/subscribe/
  * Node Name: `http://localhost:3000/api/push/subscribe/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/test
  * Node Name: `http://localhost:3000/api/push/test ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/test/
  * Node Name: `http://localhost:3000/api/push/test/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/unsubscribe
  * Node Name: `http://localhost:3000/api/push/unsubscribe ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/push/unsubscribe/
  * Node Name: `http://localhost:3000/api/push/unsubscribe/ ()({})`
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
* URL: http://localhost:3000/api/journal/entries
  * Node Name: `http://localhost:3000/api/journal/entries ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/entries/
  * Node Name: `http://localhost:3000/api/journal/entries/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/share
  * Node Name: `http://localhost:3000/api/journal/share ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/share/
  * Node Name: `http://localhost:3000/api/journal/share/ ()({})`
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


Instances: 599

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Non-Storable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are not storable by caching components such as proxy servers. If the response does not contain sensitive, personal or user-specific information, it may benefit from being stored and cached, to improve performance.

* URL: http://localhost:3000/api/account/confirm-name-change
  * Node Name: `http://localhost:3000/api/account/confirm-name-change ()({code})`
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



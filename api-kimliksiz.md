# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| Informational | 2 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Medium | Exceeded High | http://localhost:3000 | Percentage of responses with status code 4xx | 99 % |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 2xx | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type application/json | 46 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type text/html | 53 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method DELETE | 5 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method GET | 60 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PATCH | 1 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method POST | 28 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PUT | 3 % |
| Info | Informational | http://localhost:3000 | Count of total endpoints | 602    |
| Info | Informational | http://localhost:3000 | Percentage of slow responses | 3 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| Unexpected Content-Type was returned | Low | 363 |
| A Client Error response code was returned by the server | Informational | 634 |
| Non-Storable Content | Informational | Systemic |




## Alert Detail



### [ Unexpected Content-Type was returned ](https://www.zaproxy.org/docs/alerts/100001/)



##### Low (High)

### Description

A Content-Type of text/html was returned by the server.
This is not one of the types expected to be returned by an API.
Raised by the 'Alert on Unexpected Content Types' script

* URL: http://localhost:3000/api/admin/assignments/
  * Node Name: `http://localhost:3000/api/admin/assignments/`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/test/`
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
* URL: http://localhost:3000/api/assistant/messages/
  * Node Name: `http://localhost:3000/api/assistant/messages/`
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
* URL: http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/images/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/notifications/
  * Node Name: `http://localhost:3000/api/notifications/`
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
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/`
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
* URL: http://localhost:3000/7354398757029117077
  * Node Name: `http://localhost:3000/7354398757029117077`
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
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/admin/audit/actions/
  * Node Name: `http://localhost:3000/api/admin/audit/actions/`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files/`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/plans/`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/`
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
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/`
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
* URL: http://localhost:3000/api/admin/forum/levels/
  * Node Name: `http://localhost:3000/api/admin/forum/levels/`
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
* URL: http://localhost:3000/api/admin/me/
  * Node Name: `http://localhost:3000/api/admin/me/`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/`
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
* URL: http://localhost:3000/api/admin/support/summary/
  * Node Name: `http://localhost:3000/api/admin/support/summary/`
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
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/assistant/
  * Node Name: `http://localhost:3000/api/assistant/`
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
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/blog/
  * Node Name: `http://localhost:3000/api/blog/`
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
* URL: http://localhost:3000/api/board/challenge/
  * Node Name: `http://localhost:3000/api/board/challenge/`
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
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/board/me/bookmarks/
  * Node Name: `http://localhost:3000/api/board/me/bookmarks/`
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
* URL: http://localhost:3000/api/board/members/
  * Node Name: `http://localhost:3000/api/board/members/`
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
* URL: http://localhost:3000/api/board/mod/log/
  * Node Name: `http://localhost:3000/api/board/mod/log/`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/`
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
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/board/rules/
  * Node Name: `http://localhost:3000/api/board/rules/`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/`
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
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/friends/search/
  * Node Name: `http://localhost:3000/api/friends/search/`
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
* URL: http://localhost:3000/api/giphy/search/
  * Node Name: `http://localhost:3000/api/giphy/search/`
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
* URL: http://localhost:3000/api/journal/
  * Node Name: `http://localhost:3000/api/journal/`
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
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/journal/u/test/
  * Node Name: `http://localhost:3000/api/journal/u/test/`
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
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/orders/
  * Node Name: `http://localhost:3000/api/orders/`
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
* URL: http://localhost:3000/api/packages/
  * Node Name: `http://localhost:3000/api/packages/`
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
* URL: http://localhost:3000/api/plans/
  * Node Name: `http://localhost:3000/api/plans/`
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
* URL: http://localhost:3000/api/plans/overview/
  * Node Name: `http://localhost:3000/api/plans/overview/`
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
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/`
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
* URL: http://localhost:3000/api/push/key/
  * Node Name: `http://localhost:3000/api/push/key/`
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
* URL: http://localhost:3000/api/push/status/
  * Node Name: `http://localhost:3000/api/push/status/`
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
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/ ()({})`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/block/ ()({})`
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
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/archive/ ()({})`
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
* URL: http://localhost:3000/api/assistant/consent/
  * Node Name: `http://localhost:3000/api/assistant/consent/ ()({})`
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
* URL: http://localhost:3000/api/board/challenge/checkin/
  * Node Name: `http://localhost:3000/api/board/challenge/checkin/ ()({})`
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
* URL: http://localhost:3000/api/board/images/giphy/
  * Node Name: `http://localhost:3000/api/board/images/giphy/ ()({})`
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
* URL: http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/reports/00000000-0000-4000-8000-000000000001/ ()({})`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/mod/ ()({})`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/accept/ ()({})`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/posts/ ()({})`
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
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/vote/ ()({})`
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
* URL: http://localhost:3000/api/board/topics/
  * Node Name: `http://localhost:3000/api/board/topics/ ()({})`
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
* URL: http://localhost:3000/api/forum/me/media/test/
  * Node Name: `http://localhost:3000/api/forum/me/media/test/ ()({})`
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
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/block/ ()({})`
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
* URL: http://localhost:3000/api/journal/photos/
  * Node Name: `http://localhost:3000/api/journal/photos/ ()({})`
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
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/image/ ()({})`
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
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/report/ ()({})`
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
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/ ()({})`
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
* URL: http://localhost:3000/api/push/test/
  * Node Name: `http://localhost:3000/api/push/test/ ()({})`
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
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/resolve/ ()({})`
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
* URL: http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/mod/categories/00000000-0000-4000-8000-000000000001/ ()({})`
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
* URL: http://localhost:3000/api/journal/entries/
  * Node Name: `http://localhost:3000/api/journal/entries/ ()({})`
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
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `text/html`
  * Other Info: ``


Instances: 363

### Solution



### Reference




#### Source ID: 4

### [ A Client Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Informational (High)

### Description

A response code of 401 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: http://localhost:3000/api/admin/assignments
  * Node Name: `http://localhost:3000/api/admin/assignments`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/progress/00000000-0000-4000-8000-000000000001/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/7354398757029117077
  * Node Name: `http://localhost:3000/7354398757029117077`
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
* URL: http://localhost:3000/api/2fa/5082680190152306942
  * Node Name: `http://localhost:3000/api/2fa/5082680190152306942`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/2fa/recovery/4781248546048225542
  * Node Name: `http://localhost:3000/api/2fa/recovery/4781248546048225542`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/2fa/renew/1233720524275429293
  * Node Name: `http://localhost:3000/api/2fa/renew/1233720524275429293`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/6619728438915106551
  * Node Name: `http://localhost:3000/api/6619728438915106551`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/account/6909104308640963305
  * Node Name: `http://localhost:3000/api/account/6909104308640963305`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/account/login-history
  * Node Name: `http://localhost:3000/api/account/login-history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/account/password-reset/5512678046404758911
  * Node Name: `http://localhost:3000/api/account/password-reset/5512678046404758911`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/6322628156692721841
  * Node Name: `http://localhost:3000/api/admin/6322628156692721841`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/analytics
  * Node Name: `http://localhost:3000/api/admin/analytics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/attachments/2275915216938884645
  * Node Name: `http://localhost:3000/api/admin/attachments/2275915216938884645`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit
  * Node Name: `http://localhost:3000/api/admin/audit`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/
  * Node Name: `http://localhost:3000/api/admin/audit/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/2487362665003049648
  * Node Name: `http://localhost:3000/api/admin/audit/2487362665003049648`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/audit/actions
  * Node Name: `http://localhost:3000/api/admin/audit/actions`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7039983346369982489
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/7039983346369982489`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/files`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/
  * Node Name: `http://localhost:3000/api/admin/clients/00000000-0000-4000-8000-000000000001/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/clients/5732390864808104053
  * Node Name: `http://localhost:3000/api/admin/clients/5732390864808104053`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-media/2123333259014156621
  * Node Name: `http://localhost:3000/api/admin/dm-media/2123333259014156621`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports
  * Node Name: `http://localhost:3000/api/admin/dm-reports`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/7449521655240922908
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/7449521655240922908`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/
  * Node Name: `http://localhost:3000/api/admin/dm-reports/00000000-0000-4000-8000-000000000001/context/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/dm-reports/5280633971140525133
  * Node Name: `http://localhost:3000/api/admin/dm-reports/5280633971140525133`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/due-plans
  * Node Name: `http://localhost:3000/api/admin/due-plans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/forum/943631247840734437
  * Node Name: `http://localhost:3000/api/admin/forum/943631247840734437`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/forum/levels
  * Node Name: `http://localhost:3000/api/admin/forum/levels`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/8247741328296092545
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/8247741328296092545`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/7774439689506914056
  * Node Name: `http://localhost:3000/api/admin/members/00000000-0000-4000-8000-000000000001/forum/7774439689506914056`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/members/2546628742412565645
  * Node Name: `http://localhost:3000/api/admin/members/2546628742412565645`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders
  * Node Name: `http://localhost:3000/api/admin/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/8575644285995682379
  * Node Name: `http://localhost:3000/api/admin/orders/00000000-0000-4000-8000-000000000001/8575644285995682379`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/orders/2449320912344165961
  * Node Name: `http://localhost:3000/api/admin/orders/2449320912344165961`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plan-catalog
  * Node Name: `http://localhost:3000/api/admin/plan-catalog`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1206878467077333921
  * Node Name: `http://localhost:3000/api/admin/plans/00000000-0000-4000-8000-000000000001/1206878467077333921`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/plans/7674702190865428913
  * Node Name: `http://localhost:3000/api/admin/plans/7674702190865428913`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/support/8691631735531711108
  * Node Name: `http://localhost:3000/api/admin/support/8691631735531711108`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/support/summary
  * Node Name: `http://localhost:3000/api/admin/support/summary`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/1231590574397108370
  * Node Name: `http://localhost:3000/api/admin/tickets/00000000-0000-4000-8000-000000000001/1231590574397108370`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/tickets/6870768550540568954
  * Node Name: `http://localhost:3000/api/admin/tickets/6870768550540568954`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users
  * Node Name: `http://localhost:3000/api/admin/users`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/1688555379556557727
  * Node Name: `http://localhost:3000/api/admin/users/00000000-0000-4000-8000-000000000001/1688555379556557727`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/admin/users/1606220424164673955
  * Node Name: `http://localhost:3000/api/admin/users/1606220424164673955`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/analytics/2703214716588118488
  * Node Name: `http://localhost:3000/api/analytics/2703214716588118488`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant
  * Node Name: `http://localhost:3000/api/assistant`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/
  * Node Name: `http://localhost:3000/api/assistant/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/assistant/4607903148536650903
  * Node Name: `http://localhost:3000/api/assistant/4607903148536650903`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/attachments/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/attachments/6138388073390667165
  * Node Name: `http://localhost:3000/api/attachments/6138388073390667165`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/auth/5770586727013267272
  * Node Name: `http://localhost:3000/api/auth/5770586727013267272`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/auth/login/737709287711497549
  * Node Name: `http://localhost:3000/api/auth/login/737709287711497549`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/me
  * Node Name: `http://localhost:3000/api/auth/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/auth/register/3290274240903439810
  * Node Name: `http://localhost:3000/api/auth/register/3290274240903439810`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/auth/reset-password/5511734854076011122
  * Node Name: `http://localhost:3000/api/auth/reset-password/5511734854076011122`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/
  * Node Name: `http://localhost:3000/api/blog/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/8932325472896693228
  * Node Name: `http://localhost:3000/api/blog/8932325472896693228`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/blog/test
  * Node Name: `http://localhost:3000/api/blog/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/board/2956567762053897559
  * Node Name: `http://localhost:3000/api/board/2956567762053897559`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge
  * Node Name: `http://localhost:3000/api/board/challenge`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/
  * Node Name: `http://localhost:3000/api/board/challenge/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/challenge/7579540216602238249
  * Node Name: `http://localhost:3000/api/board/challenge/7579540216602238249`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/home
  * Node Name: `http://localhost:3000/api/board/home`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/images/2663254588806735836
  * Node Name: `http://localhost:3000/api/board/images/2663254588806735836`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/img/6865105261485586580
  * Node Name: `http://localhost:3000/api/board/img/6865105261485586580`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/me/280433875851380343
  * Node Name: `http://localhost:3000/api/board/me/280433875851380343`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/me/bookmarks
  * Node Name: `http://localhost:3000/api/board/me/bookmarks`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/mod/5652155823040294828
  * Node Name: `http://localhost:3000/api/board/mod/5652155823040294828`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/board/mod/ban/2969588760244641564
  * Node Name: `http://localhost:3000/api/board/mod/ban/2969588760244641564`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/bans
  * Node Name: `http://localhost:3000/api/board/mod/bans`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/mod/categories/2912841133296150324
  * Node Name: `http://localhost:3000/api/board/mod/categories/2912841133296150324`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/log
  * Node Name: `http://localhost:3000/api/board/mod/log`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/
  * Node Name: `http://localhost:3000/api/board/mod/reports/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/reports/6314830497897340422
  * Node Name: `http://localhost:3000/api/board/mod/reports/6314830497897340422`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/board/mod/u/885051383253579923
  * Node Name: `http://localhost:3000/api/board/mod/u/885051383253579923`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/board/mod/u/test/2225201287506714005
  * Node Name: `http://localhost:3000/api/board/mod/u/test/2225201287506714005`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/mod/u/test/content
  * Node Name: `http://localhost:3000/api/board/mod/u/test/content`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/6932129066597795318
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/6932129066597795318`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/
  * Node Name: `http://localhost:3000/api/board/posts/00000000-0000-4000-8000-000000000001/history/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/posts/4004576430907422540
  * Node Name: `http://localhost:3000/api/board/posts/4004576430907422540`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/board/public/2185663798079463767
  * Node Name: `http://localhost:3000/api/board/public/2185663798079463767`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/img/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/img/3676463909635034715
  * Node Name: `http://localhost:3000/api/board/public/img/3676463909635034715`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/public/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/public/t/3572545472555691706
  * Node Name: `http://localhost:3000/api/board/public/t/3572545472555691706`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/1709550265433539928
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/1709550265433539928`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/
  * Node Name: `http://localhost:3000/api/board/t/00000000-0000-4000-8000-000000000001/since/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/board/t/3130406652723154529
  * Node Name: `http://localhost:3000/api/board/t/3130406652723154529`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/topics
  * Node Name: `http://localhost:3000/api/board/topics`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/board/u/8681634241964463463
  * Node Name: `http://localhost:3000/api/board/u/8681634241964463463`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/board/u/test
  * Node Name: `http://localhost:3000/api/board/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/dm-media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/dm-media/3738317434070510017
  * Node Name: `http://localhost:3000/api/dm-media/3738317434070510017`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/forum/8886619704520264686
  * Node Name: `http://localhost:3000/api/forum/8886619704520264686`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me
  * Node Name: `http://localhost:3000/api/forum/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/
  * Node Name: `http://localhost:3000/api/forum/me/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/me/416005293475262506
  * Node Name: `http://localhost:3000/api/forum/me/416005293475262506`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/forum/me/media/8768294659076900514
  * Node Name: `http://localhost:3000/api/forum/me/media/8768294659076900514`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/forum/me/media/sig/5917400626549335531
  * Node Name: `http://localhost:3000/api/forum/me/media/sig/5917400626549335531`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/forum/media/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/forum/media/3184006939840168486
  * Node Name: `http://localhost:3000/api/forum/media/3184006939840168486`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
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
* URL: http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/2717673743249404657
  * Node Name: `http://localhost:3000/api/friends/00000000-0000-4000-8000-000000000001/2717673743249404657`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/8504138641387073885
  * Node Name: `http://localhost:3000/api/friends/8504138641387073885`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/friends/search
  * Node Name: `http://localhost:3000/api/friends/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
* URL: http://localhost:3000/api/giphy/40734326377603321
  * Node Name: `http://localhost:3000/api/giphy/40734326377603321`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/giphy/search
  * Node Name: `http://localhost:3000/api/giphy/search`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/
  * Node Name: `http://localhost:3000/api/journal/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/5777934866178792850
  * Node Name: `http://localhost:3000/api/journal/5777934866178792850`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/journal/entries/4716244381882604812
  * Node Name: `http://localhost:3000/api/journal/entries/4716244381882604812`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/journal/photos/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/photos/210296484554655992
  * Node Name: `http://localhost:3000/api/journal/photos/210296484554655992`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/journal/u/6711242496167206482
  * Node Name: `http://localhost:3000/api/journal/u/6711242496167206482`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/journal/u/test
  * Node Name: `http://localhost:3000/api/journal/u/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/9081684544505507500
  * Node Name: `http://localhost:3000/api/messages/00000000-0000-4000-8000-000000000001/9081684544505507500`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/3058902065127552593
  * Node Name: `http://localhost:3000/api/messages/3058902065127552593`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/6330662473196847140
  * Node Name: `http://localhost:3000/api/messages/m/00000000-0000-4000-8000-000000000001/6330662473196847140`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/messages/m/1424334575839865664
  * Node Name: `http://localhost:3000/api/messages/m/1424334575839865664`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications
  * Node Name: `http://localhost:3000/api/notifications`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/4598509276732011288
  * Node Name: `http://localhost:3000/api/notifications/00000000-0000-4000-8000-000000000001/4598509276732011288`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/notifications/2143805909896097427
  * Node Name: `http://localhost:3000/api/notifications/2143805909896097427`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/orders
  * Node Name: `http://localhost:3000/api/orders`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/5881068207044213212
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/5881068207044213212`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/177686927986302689
  * Node Name: `http://localhost:3000/api/orders/00000000-0000-4000-8000-000000000001/pay/177686927986302689`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/orders/5765428119909564228
  * Node Name: `http://localhost:3000/api/orders/5765428119909564228`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/plans/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/3725580822626712463
  * Node Name: `http://localhost:3000/api/plans/3725580822626712463`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/plans/overview
  * Node Name: `http://localhost:3000/api/plans/overview`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/
  * Node Name: `http://localhost:3000/api/progress/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/progress/5194663116925857644
  * Node Name: `http://localhost:3000/api/progress/5194663116925857644`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
* URL: http://localhost:3000/api/push/4951003580208154089
  * Node Name: `http://localhost:3000/api/push/4951003580208154089`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/4175105157753388348
  * Node Name: `http://localhost:3000/api/tickets/00000000-0000-4000-8000-000000000001/4175105157753388348`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/tickets/2964656483905134642
  * Node Name: `http://localhost:3000/api/tickets/2964656483905134642`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
* URL: http://localhost:3000/api/uploads/8611925490489962237
  * Node Name: `http://localhost:3000/api/uploads/8611925490489962237`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/uploads/test
  * Node Name: `http://localhost:3000/api/uploads/test`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `403`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/event/
  * Node Name: `http://localhost:3000/api/analytics/event/ ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://localhost:3000/api/analytics/hit
  * Node Name: `http://localhost:3000/api/analytics/hit ()({})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `403`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `400`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `404`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
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
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/profile/
  * Node Name: `http://localhost:3000/api/profile/ ()({})`
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``


Instances: 634

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
  * Evidence: `no-store`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-email-change
  * Node Name: `http://localhost:3000/api/account/request-email-change ()({newEmail})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-store`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-name-change
  * Node Name: `http://localhost:3000/api/account/request-name-change ()({newName})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-store`
  * Other Info: ``
* URL: http://localhost:3000/api/account/request-password-change
  * Node Name: `http://localhost:3000/api/account/request-password-change ()({oldPassword,newPassword})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-store`
  * Other Info: ``
* URL: http://localhost:3000/api/account/resend-code
  * Node Name: `http://localhost:3000/api/account/resend-code ()({purpose})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `no-store`
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



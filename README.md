# ournet-api

Ournet API app. Typescript version.

```
certbot certonly --cert-name ournetapi-com --dns-route53 -m info@ournet-group.com --agree-tos --non-interactive --post-hook "sudo service nginx reload" -d ournetapi.com -d *.ournetapi.com
```

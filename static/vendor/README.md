# Vendored Browser Assets

The energy dashboard self-hosts browser dependencies so the site CSP can keep `script-src 'self'`.

| Package | Version | Source | npm integrity | SHA-256 |
| --- | --- | --- | --- | --- |
| PapaParse | 5.5.3 | `https://registry.npmjs.org/papaparse/-/papaparse-5.5.3.tgz` | `sha512-5QvjGxYVjxO59MGU2lHVYpRWBBtKHnlIAcSe1uNFCkkptUh63NFRj0FJQm7nR67puEruUci/ZkjmEFrjCAyP4A==` | `3553fb8bdf5b8004ce5531e6827e81c8b34e7b3992677967754544064e97b016` |
| Chart.js | 4.5.1 | `https://registry.npmjs.org/chart.js/-/chart.js-4.5.1.tgz` | `sha512-GIjfiT9dbmHRiYi6Nl2yFCq7kkwdkp1W/lp2J99rX0yo9tgJGn3lKQATztIjb5tVtevcBtIdICNWqlq5+E8/Pw==` | `48444a82d4edcb5bec0f1965faacdde18d9c17db3063d042abada2f705c9f54a` |
| chartjs-adapter-date-fns | 3.0.0 | `https://registry.npmjs.org/chartjs-adapter-date-fns/-/chartjs-adapter-date-fns-3.0.0.tgz` | `sha512-Rs3iEB3Q5pJ973J93OBTpnP7qoGwvq3nUnoMdtxO+9aoJof7UFcRbWcIDteXuYd1fgAvct/32T9qaLyLuZVwCg==` | `ea7ab30d26c38dcf1f2d26bb43e73a94537b58f1906f55e1a546dd09321b5615` |

Refresh these files with `npm pack <package>@<version>` and copy only the browser bundle required by `layouts/energy/list.html`.

# w.shoette.com — "What is wrong with me"

Landing site for **What is wrong with me**, the AI health journal you talk to.
Bilingual one-page site (English by default, French under `/fr/`), hosted on the
`w` subdomain of shoette.com (OVH shared hosting).

🔗 Live: https://w.shoette.com/ · 🇫🇷 https://w.shoette.com/fr/

## Structure

| Path | Role |
|------|------|
| `index.html` | English homepage (default) |
| `fr/index.html` | French version |
| `subscribe.php` | Waitlist endpoint — appends `timestamp, email, lang` to `waitlist.csv` |
| `.htaccess` | MIME types, `waitlist.csv` web-protection (403), 404 → homepage redirect |
| `site.webmanifest` | PWA manifest |
| `favicon.ico` / `favicon.svg` / `favicon-16.png` / `favicon-32.png` | Browser favicons |
| `apple-touch-icon.png` / `icon-192.png` / `icon-512.png` | iOS / Android / PWA icons |
| `favicon-1.png` | High-res logo export |
| `W-screen1.pdf` / `W-screen2.pdf` | Design references |

## Deploy

Static site + one PHP endpoint. Upload the web files to the FTP **`w/`** directory
(host `ftp.cluster014.hosting.ovh.net`).

> `waitlist.csv` is intentionally **not** in the repo — it contains real signup
> emails and lives only on the server (retrievable via FTP). It is git-ignored.

## Notes

- Brand colour `#F04848`; logo = the letter **w**.
- The waitlist form posts to `/subscribe.php`; each page reports its own language
  (`en` / `fr`) via `document.documentElement.lang`.
- **Not a medical device** — provides insights to users and their healthcare
  professionals; does not provide a diagnosis.

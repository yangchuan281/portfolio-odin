# ─────────────────────────────────────────────────────────────
# Static portfolio served by Nginx in a container.
# Build context is the repo root; only the static files ship.
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="odin-portfolio" \
      org.opencontainers.image.description="Static personal portfolio served by Nginx" \
      org.opencontainers.image.licenses="MIT"

# Replace the stock site config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static payload
COPY index.html /usr/share/nginx/html/index.html
COPY projects.html /usr/share/nginx/html/projects.html
COPY projects/ /usr/share/nginx/html/projects/
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY assets/    /usr/share/nginx/html/assets/

# Files land as root:root 0644 — world readable, so the nginx worker
# user can serve them without any chown.

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

const RESERVED_SUBDOMAINS = new Set(['www', 'new', 'admin', 'api', 'app']);
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export function getSubdomainSlug(hostname: string) {
  const lowerHost = hostname.toLowerCase().split(':')[0];

  if (LOCAL_HOSTS.has(lowerHost)) {
    return null;
  }

  const parts = lowerHost.split('.');
  if (parts.length < 3) return null;

  const subdomain = parts[0];
  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) return null;

  return subdomain;
}

export function getBaseDomain(hostname: string) {
  const lowerHost = hostname.toLowerCase().split(':')[0];
  const parts = lowerHost.split('.');

  if (parts.length < 2 || LOCAL_HOSTS.has(lowerHost)) {
    return lowerHost;
  }

  return parts.slice(-2).join('.');
}

export function getProjectCanonicalUrl(projectSlug: string, subdomain?: string) {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';

  if (!subdomain) {
    return `${protocol}//${host}/${projectSlug}`;
  }

  const baseDomain = getBaseDomain(hostname);

  if (baseDomain === 'localhost' || baseDomain === '127.0.0.1') {
    return `${protocol}//${host}/${projectSlug}`;
  }

  return `${protocol}//${subdomain}.${baseDomain}${port}/`;
}


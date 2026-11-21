// Remote image hosts allowed by next/image (used in next.config.ts)
export const allowedImageHosts = [
  "static.wikia.nocookie.net",
  "d15f34w2p8l1cc.cloudfront.net",
  "cdn.discordapp.com",
  "liquipedia.net",
];

export function isAllowedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && allowedImageHosts.includes(url.hostname)
    );
  } catch {
    return false;
  }
}

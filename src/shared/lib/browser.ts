export const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

interface OpenUrlOptions {
  target?: "_blank" | "_self";
}

export const openUrl = (url: string, options: OpenUrlOptions = {}) => {
  const { target = "_blank" } = options;

  if (target === "_self") {
    window.location.assign(url);
    return;
  }

  window.open(url, target, "noopener,noreferrer");
};

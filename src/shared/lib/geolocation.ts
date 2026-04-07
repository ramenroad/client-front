export const requestLocationPermission = async (): Promise<PermissionState | "unsupported"> => {
  try {
    if (!navigator.geolocation) {
      return "unsupported";
    }

    if ("permissions" in navigator && "query" in navigator.permissions) {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      return permission.state;
    }

    return "prompt";
  } catch {
    return "prompt";
  }
};

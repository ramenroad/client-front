export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (!navigator.geolocation) {
      return false;
    }

    if ("permissions" in navigator) {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") return false;
      if (permission.state === "granted") return true;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 },
      );
    });
  } catch (_error) {
    return false;
  }
};

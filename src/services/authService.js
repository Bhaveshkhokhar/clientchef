export const checkAuthStatus = async (signal) => {
  try {
    const response = await fetch("https://serverofchefbooking.onrender.com/chefcheckauthstatus", {
      method: "GET",
      credentials: "include",
      signal,
    });
    if (!response.ok) {
      if (response.status === 401) {
        return { isLoggedIn: false };
      }
      if( response.status === 404) {
        return { isLoggedIn: false };
      }
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      throw new Error("Failed to fetch authentication status");
    }
    const data = await response.json();
    return mapServerAuthToLocalAuth(data);
  } catch (err) {
    throw err;
  }
};
const mapServerAuthToLocalAuth = (serverAuth) => {
  return {
    isLoggedIn: serverAuth.isLoggedIn,
  };
};

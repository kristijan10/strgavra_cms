export default async (path, options = {}) => {
  const url =
    (import.meta.env.VITE_BACKEND_URL || "http://localhost:8000") + path;

  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) throw new Error(data.message);
  return data;
};

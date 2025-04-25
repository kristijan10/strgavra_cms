import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext.js";
import { useNavigate } from "react-router";

const users = [
  { username: "kristijan", password: "123" },
  { username: "jovan", password: "123" },
];

const Login = () => {
  const initialData = { username: "", password: "" };
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const { login, hasToken } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    if (hasToken) navigate("/");
    else usernameRef.current.focus();
  }, [hasToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = users.find(
        (u) => u.username === data.username && u.password === data.password
      );
      if (!user) {
        setError("Kredencijali nisu tačni");
        usernameRef.current.focus();
        throw new Error("Kredencijali nisu tacni");
      }

      login(user);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setData(initialData);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-screen h-screen bg-blue-400 flex items-center justify-center">
      <form className="flex flex-col gap-4 p-8 bg-blue-300 items-center">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            value={data.username}
            onChange={handleChange}
            className="border-1 py-1 px-2"
            ref={usernameRef}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            className="border-1 py-1 px-2"
          />
        </div>
        <button
          type="submit"
          className="border-1 w-fit py-1 px-2 cursor-pointer hover:text-gray-600"
          onClick={handleSubmit}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

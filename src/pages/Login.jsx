import { useState } from "react";
import { loginUser } from "../api/auth";
import { Spinner } from "react-bootstrap"; // Import Spinner
import "../styles/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const response = await loginUser(email, password);
        const data = response.data;

        const role = data.role;
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "member") {
          window.location.href = "/dashboard";
        } else {
          alert("Role tidak dikenali.");
        }
      } catch (err) {
        alert("Login gagal: " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Delay 1 detik
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-primary">
      <div className="text-center text-white mb-4">
        <h2>Masuk</h2>
        <p className="sub-judul">Selamat datang kembali di Perpustakaan Jaya Abadi!</p>
      </div>

      <div className="login-content p-5 rounded shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgot-password" className="text-muted">Lupa Password?</a>
        </div>

        <div className="text-center mt-2">
          <p className="text-muted">Belum punya akun? <a href="/register" className="text-primary fw-bold">Daftar di sini!</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

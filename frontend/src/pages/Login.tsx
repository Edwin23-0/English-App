import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import "./../styles/Login.css";

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegistering) {
      setFormData({ nombre: "", email: "", password: "", confirmPassword: "" });
    }
  }, [isRegistering]);

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSymbol = /[\W_]/;

    if (!minLength.test(password)) setPasswordError("Debe tener al menos 8 caracteres.");
    else if (!hasUpperCase.test(password)) setPasswordError("Debe contener al menos una mayúscula.");
    else if (!hasLowerCase.test(password)) setPasswordError("Debe contener al menos una minúscula.");
    else if (!hasSymbol.test(password)) setPasswordError("Debe contener al menos un símbolo.");
    else setPasswordError("");
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== formData.password) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
      if (formData.confirmPassword) validateConfirmPassword(formData.confirmPassword);
    }

    if (name === "confirmPassword") {
      validateConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && (passwordError || confirmPasswordError)) {
      alert("Corrige los errores de la contraseña antes de continuar.");
      return;
    }

    const url = isRegistering ? "http://localhost:5000/register" : "http://localhost:5000/login";
    const payload = isRegistering
      ? { nombre: formData.nombre, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(data.mensaje || data.error || "Ocurrió un error");

      if (response.ok) {
        if (isRegistering) {
          console.log("Registro exitoso, redirigiendo al login...");
          setIsRegistering(false);
          navigate("/login", { replace: true });
        } else {
          console.log("Login exitoso, redirigiendo...");

          // Guardamos el usuario en localStorage
          localStorage.setItem("user", JSON.stringify({ nombre: data.usuario })); 

          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AuthForm
      isRegistering={isRegistering}
      formData={formData}
      passwordError={passwordError}
      confirmPasswordError={confirmPasswordError}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      toggleRegister={() => setIsRegistering(!isRegistering)}
    />
  );
};

export default Login;

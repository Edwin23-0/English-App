interface AuthFormProps {
    isRegistering: boolean;
    formData: { nombre: string; email: string; password: string; confirmPassword: string };
    passwordError: string;
    confirmPasswordError: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    toggleRegister: () => void;
  }
  
  const AuthForm: React.FC<AuthFormProps> = ({
    isRegistering,
    formData,
    passwordError,
    confirmPasswordError,
    handleChange,
    handleSubmit,
    toggleRegister,
  }) => {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          {isRegistering && (
            <input
              type="text"
              name="nombre"
              placeholder="Full Name"
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="new-name"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            style={{ borderColor: passwordError ? "red" : "" }}
          />
          {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
  
          {isRegistering && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ borderColor: confirmPasswordError ? "red" : "" }}
              />
              {confirmPasswordError && (
                <p style={{ color: "red", fontSize: "12px" }}>{confirmPasswordError}</p>
              )}
            </>
          )}
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>
        <p onClick={toggleRegister}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    );
  };
  
  export default AuthForm;
  
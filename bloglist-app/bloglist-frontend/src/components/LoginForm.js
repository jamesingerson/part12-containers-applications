const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      username{" "}
      <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        id="username"
      />
    </div>
    <div>
      password{" "}
      <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        id="password"
      />
    </div>
    <button type="submit" id="login-button">
      login
    </button>
  </form>
);

export default LoginForm;

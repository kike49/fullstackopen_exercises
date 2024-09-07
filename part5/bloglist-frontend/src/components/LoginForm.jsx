import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, handleUsername, handlePassword, username, password }) => (
  <form onSubmit={handleSubmit}>
    <div>
      Username{' '}
      <input
        type="text"
        value={username}
        name="username"
        placeholder='username'
        onChange={handleUsername}
      />
    </div>
    <div>
      Password{' '}
      <input
        type="text"
        value={password}
        name="password"
        placeholder='password'
        onChange={handlePassword}
      />
    </div>
    <button type="submit">Login</button>
  </form>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
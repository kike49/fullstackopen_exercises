const Notification = ({ message, classMessage }) => {
  if (!message) {
    return null
  }
  return <div className={classMessage}>{message}</div>
}

export default Notification

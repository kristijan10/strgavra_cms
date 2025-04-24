export default ({ message, status }) => {
  throw Object.assign(new Error(message), { status });
};

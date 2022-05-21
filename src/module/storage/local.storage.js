function save(token, key = "auth") {
  console.log("token saved", token);
  localStorage.setItem(key, token);
}

function get(key) {
  return localStorage.getItem(key);
}

export { save, get };

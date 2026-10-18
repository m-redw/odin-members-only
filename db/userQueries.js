const pool = require("./pool");

async function getUser(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

async function addUser(username, password) {
  await pool.query(
    "INSERT INTO users (username, password, isMember, isAdmin) VALUES ($1, $2, FALSE, FALSE)",
    [username, password],
  );
}

async function updateUserMember(id) {
  await pool.query("UPDATE users SET isMember = TRUE WHERE id = $1", [id]);
}

async function updateUserAdmin(id) {
  await pool.query("UPDATE users SET isAdmin = TRUE WHERE id = $1", [id]);
}

async function removeUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

module.exports = {};

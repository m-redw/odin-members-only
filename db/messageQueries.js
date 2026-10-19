const pool = require("./pool");

async function getMessage(id) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [
    id,
  ]);
  return rows[0];
}

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function addMessage(message, author, date) {
  await pool.query(
    "INSERT INTO messages (message, author, date) VALUES ($1, $2, $3)",
    [message, author, date],
  );
}

async function removeMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = {
  getMessage,
  getAllMessages,
  addMessage,
  removeMessage,
};

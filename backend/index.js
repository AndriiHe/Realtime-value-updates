const { Pool } = require('pg');
const pool = new Pool();

const WebSocket = require('ws');
const server = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(message);
  });
  function push() {
    setTimeout(async ()=>{
      if (ws.readyState != 1) return;

      const rs = await pool.query('select * from numbers order by id;');
      const array = new Int16Array(rs.rows.length);
      for (let i = 0; i < rs.rows.length; i++)
        array[i] = rs.rows[i].value;
      ws.send(array, { binary: true });

      push();
    }, 100);
  }
  push();
});

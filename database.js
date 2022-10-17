//const mysql = require("mysql2");
//let db = null;

const lodash = require('lodash')

// настраиваем БД
const low = require('lowdb')

const FileSync = require('lowdb/adapters/FileSync')
// БД хранится в директории "db" под названием "messages.json"
const adapter = new FileSync('db/messages.json')

class DB {
  constructor() {
    /*db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "DB_PASSWORD",
      database: "advanced-chat-app",
    });
    db.connect(function (err) {
      if (err) console.log(err);
    });*/
    const db = low(adapter)
    
    // записываем в БД начальные данные
    db.defaults({
        messages: [
            {
                user_id: 1,
                message: 'What are you doing here?',
                name: 'Bob',
                createdAt: '2021-01-14',
            },
            {
                user_id: 2,
                message: 'Go back to work!',
                name: 'Alice',
                createdAt: '2021-02-15'
            }
        ],
        users: [
            {
                name: 'Bob',
                user_id: 1,
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLkbtTa0kfmKizxJgqECQLdlt_xq1R2jEQQ&usqp=CAU'
            },
            {
                name: 'Alice',
                user_id: 2,
                avatar: 'https://cdn.icon-icons.com/icons2/1879/PNG/512/iconfinder-9-avatar-2754584_120518.png'
            }
        ]
    }).write()

    db.chain = lodash.chain(db.data)
  }

  addUser(data) {
    return new Promise(async (resolve, reject) => {
      if (await this.isUserExist(data)) {
        resolve(true);
      } else
        /*db.execute(
          "INSERT INTO users (name, user_id) VALUES (?,?)",
          [data.name, data.user_id],
          function (err, rows) {
            if (err) reject(new Error(err));
            else resolve(rows);
          }
        );*/
        db.get('users')
            .push({
                user_id: data.user_id,
                name: data.name,
                avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            })
            .write()
    });
  }

  isUserExist(data) {
    return new Promise((resolve, reject) => {
      /*db.execute(
        "SELECT * FROM users WHERE name = ?",
        [data.name],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows[0]);
        }
      );*/

      const user = db.chain.get('users')
        .find({ name: data.name })
        .value()

        resolve(user)
    });
  }

  fetchUserMessages(data) {
    const messages = [];
    return new Promise((resolve, reject) => {
        /*db.query(
            "SELECT * from messages where name =?",
            [data.name],
            function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
            }
        );*/

        const messages = db.chain.get('messages')
            .filter({ name: data.name })
            .value()

        resolve(messages)
    });
  }

  storeUserMessage(data) {
    return new Promise((resolve, reject) => {
      /*db.query(
        "INSERT INTO messages (message, user_id, name) VALUES (?,?,?)",
        [data.message, data.user_id, data.name],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );*/

      db.get('messages')
        .push({
            user_id: data.user_id,
            message: data.message,
            name: data.name,
        })
        .write()
    });
  }
}

module.exports = DB;
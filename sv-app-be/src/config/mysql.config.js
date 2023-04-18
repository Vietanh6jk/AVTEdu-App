const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();


// const DatabaseName= process.env.DATABASE_NAME  ;
// const DatabaseUsername= process.env.DATABASE_USERNAME  ;
// const DatabasePassword= process.env.DATABASE_PASSWORD  ;

// const DatabaseName = "sinhviendb";
// const DatabaseUsername = "root";
// // const DatabasePassword = "Sapassword_123";
// const DatabasePassword = "sapassword";

// const ConnectDB = (function () {
//     var instance;
//     function init() {
//         // const CheckDB_Promise = new Promise((resolve, reject) => {
//         //     mysql.createConnection({
//         //         user: DatabaseUsername,
//         //         password: DatabasePassword
//         //     }).then((connection) => {
//         //         connection.query(`CREATE DATABASE IF NOT EXISTS ${DatabaseName};`);
//         //     });
//         // });
//         // CheckDB_Promise
//         //     .then((err) => console.log(err));
//         const sequelize = new Sequelize(
//             `${DatabaseName}`,
//             `${DatabaseUsername}`,
//             `${DatabasePassword}`,
//             {
//                 host: 'localhost',
//                 dialect: 'mysql',
//                 logging: false,
//                 port:process.env.MYSQL_PORT||3306
//             }
//         );
//         sequelize.authenticate().then(() => {
//         }).catch((error) => {
//             console.error('Unable to connect to the database: ', error);
//         });
//         return sequelize;
//     }

//     return {
//         getInstance: function () {
//             if (!instance) instance = init();
//             return instance;
//         }
//     }
// })


// module.exports = {
//     ConnectDB
// };

//#region Connect RDS
// const Sequelize = require('sequelize');
// const mysql = require('mysql2/promise');
// require('dotenv').config();



// const DatabaseName = "sinhviendb";
// const DatabaseUsername = 'admin';
// const DatabasePassword = "12345678";


// const Sequelize = require('sequelize');
// const mysql = require('mysql2/promise');
// require('dotenv').config();



const DatabaseName = "sinhviendb";
const DatabaseUsername = 'admin';
const DatabasePassword = "12345678";


const ConnectDB = (function () {
    var instance;
    function init() {
        const sequelize = new Sequelize(
            `${DatabaseName}`,
            `${DatabaseUsername}`,
            `${DatabasePassword}`,
            {
                host: 'database-1.chodan0pjpbf.ap-southeast-1.rds.amazonaws.com',
                dialect: 'mysql',
            }

        );
        sequelize.authenticate().then(() => {
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });
        return sequelize;
    }
    return {
        getInstance: function () {
            // if (!instance) instance = init();
            instance = init();
            return instance;
        }
    }
});


module.exports = {
    ConnectDB
};
const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

let sequelize;

(async () => {
    if (process.env.NODE_ENV === 'test') {
        sequelize = new Sequelize('sqlite:///:memory:', {
            dialect: 'sqlite',
        });
    } else {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {rejectUnauthorized: false},
            }
        });
    }

    async function connect() {
        let retries = 5;
        while (retries) {
            try {
                await sequelize.authenticate();
                console.log('Connection has been established successfully.');
                return sequelize;
            } catch (err) {
                console.error('Unable to connect to the database:', err);
            }
            retries -= 1;
            console.log(`retries left: ${retries}`);
            // wait 5 seconds
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    await connect();
    // await sequelize.sync({force: true}); // force: true drops the table if it already exists
})();

module.exports = sequelize;
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
    }
);

const Contact = sequelize.define('Contacts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    linkedId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: Sequelize.STRING(32),
        allowNull: false,
        validate: {
            isIn: [['primary', 'secondary']],
        },
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
    },
},
    {
        freezeTableName: true,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
})();

module.exports = Contact;

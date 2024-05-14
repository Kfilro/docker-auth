const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('sql', 'postgres', '1', {
    host: 'localhost',
    dialect: 'postgres'
}
);


const Task = sequelize.define('Task', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
}, {
    tableName: 'Task', 
    timestamps: false 
});

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
});
module.exports = { User, Task };

User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'task'
});

Task.belongsTo(User,{
    foreignKey: 'userId',
});

module.exports.getTask = async (userId) => {
    
        const tasks = await Task.findAll({
            where: {
                userId
            }
        });
        return tasks;
    
};


module.exports.addTask = async (name, userId) => {
    await Task.create({
        name,
        userId
    });
};

module.exports.completeTask = async (taskId) => {
    await Task.update({ completed: true }, {
        where: {
            id: taskId
        }
    });
    
};

module.exports.deleteTask = async (taskId) => {
    await Task.destroy({
        where: {
            id: taskId
        }
    });
};

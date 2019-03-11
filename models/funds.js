module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
        'funds',
        {
            'id': {
                'type': DataTypes.INTEGER,
                'primaryKey': true,
                'autoIncrement': true
            },
            'name': {
                'type': DataTypes.INTEGER,
                'unique': true,
                'allowNull': false
            },
            'contract_address': {
                'type': DataTypes.STRING,
                'allowNull': false
            },
            'contract_address': {
                'type': DataTypes.STRING,
                'allowNull': false
            },
            'creator_address': {
                'type': DataTypes.STRING,
                'allowNull': false
            },
        }, {
            'tableName': 'funds',
            'timestamps': false,
            'underscored': true,
            'scopes': {
                'all': {
                    'order': [['id', 'DESC']],
                    'limit': 1
                },
                'byNumber': number => {
                    return {
                        'where': { 'number': number },
                        'order': [['number', 'DESC']],
                        'limit': 1
                    }
                },
                'byContract': address => {
                    return {
                        'where': { 'address': address },
                        'order': [['id', 'DESC']],
                        'limit': 1
                    }
                },
                'byName': name => {
                    return {
                        'where': { 'name': name },
                        'order': [['id', 'DESC']],
                        'limit': 1
                    }
                }
            }
        }
    );
};
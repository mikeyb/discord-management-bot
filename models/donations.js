module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
        'donations',
        {
            'id': {
                'type': DataTypes.INTEGER,
                'primaryKey': true,
                'autoIncrement': true
            },
            'fund_id': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'donor_address': {
                'type': DataTypes.STRING,
                'allowNull': false
            },
            'amount': {
                'type': DataTypes.STRING,
                'allowNull': false
            }
        }, {
            'tableName': 'donations',
            'timestamps': false,
            'underscored': true,
            'scopes': {
                'byFund': fundId => {
                    return {
                        'where': { 'fund_id': fundId },
                        'order': [['id', 'DESC']]
                    }
                },
                'byDonor': address => {
                    return {
                        'where': { 'donor_address': address },
                        'order': [['id', 'DESC']]
                    }
                }
            }
        }
    );
};
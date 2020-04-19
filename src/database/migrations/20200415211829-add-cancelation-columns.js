module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('recipients', 'canceled_at', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('couriers', 'canceled_at', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('recipients', 'canceled_at'),
      queryInterface.removeColumn('couriers', 'canceled_at'),
    ]);
  },
};

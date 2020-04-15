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

  down: (queryInterface, Sequelize) => {},
};

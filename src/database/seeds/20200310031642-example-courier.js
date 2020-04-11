module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'couriers',
      [
        {
          name: 'Jefferson',
          email: 'jefferson@correios.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

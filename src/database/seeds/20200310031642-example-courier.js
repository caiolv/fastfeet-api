module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'couriers',
      [
        {
          name: 'Alisson Oliveira',
          email: 'alisson@correios.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Leandro Nunes',
          email: 'leadro@correios.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Amanda Castro',
          email: 'amanda@correios.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Amaral Júnior',
          email: 'amaral@correios.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

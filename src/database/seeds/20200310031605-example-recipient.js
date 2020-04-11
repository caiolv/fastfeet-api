module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'recipients',
      [
        {
          name: 'Caio Oliveira',
          street: 'SQN 116 Bloco A',
          number: '308',
          city: 'Brasília',
          state: 'DF',
          cep: '70773010',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

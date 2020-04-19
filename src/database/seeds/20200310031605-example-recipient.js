module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'recipients',
      [
        {
          name: 'Caio Oliveira',
          street: 'SQN 117 Bloco Z',
          number: '606',
          city: 'Brasília',
          state: 'DF',
          cep: '70775090',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gabriel Couto',
          street: 'SQN 118 Bloco B',
          number: '606',
          city: 'Brasília',
          state: 'DF',
          cep: '70776020',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gabriela Porto',
          street: 'Rua Sei La O Que',
          number: '606',
          city: 'Uberlândia',
          state: 'MG',
          cep: '70746020',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

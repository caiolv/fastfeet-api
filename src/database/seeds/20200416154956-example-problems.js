module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'delivery_problems',
      [
        {
          delivery_id: '1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dui ipsum, cursus id lobortis vel, congue egestas turpis. Nullam fermentum id nisl sed sollicitudin. Fusce porttitor, urna nec pulvinar tristique, risus metus iaculis lacus, sit amet finibus tellus nisi at dolor. Ut quis neque non sapien ullamcorper vulputate sed eget nisi. Aliquam a felis et massa mattis suscipit vel sed turpis. Sed fermentum, nibh nec finibus dignissim, nibh odio ultricies ex, ut egestas lectus quam vulputate leo.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          delivery_id: '5',
          description:
            'Nunc ornare rhoncus augue, commodo finibus nisi fermentum nec. Mauris et consequat leo. Nullam vel turpis est. Phasellus fermentum, dui nec lobortis rutrum, mi orci pretium ex, eget pellentesque ligula magna non mauris. Aliquam aliquam lectus quis sem condimentum, sit amet aliquam nulla venenatis. Etiam congue sollicitudin orci, ut eleifend urna tristique sit amet.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          delivery_id: '6',
          description:
            'Nunc ornare rhoncus augue, commodo finibus nisi fermentum nec. Mauris et consequat leo. Nullam vel turpis est. Phasellus fermentum, dui nec lobortis rutrum, mi orci pretium ex, eget pellentesque ligula magna non mauris. Aliquam aliquam lectus quis sem condimentum, sit amet aliquam nulla venenatis. Etiam congue sollicitudin orci, ut eleifend urna tristique sit amet.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          delivery_id: '6',
          description:
            'Nunc ornare rhoncus augue, commodo finibus nisi fermentum nec. Mauris et consequat leo. Nullam vel turpis est. Phasellus fermentum, dui nec lobortis rutrum, mi orci pretium ex, eget pellentesque ligula magna non mauris. Aliquam aliquam lectus quis sem condimentum, sit amet aliquam nulla venenatis. Etiam congue sollicitudin orci, ut eleifend urna tristique sit amet.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          delivery_id: '3',
          description:
            'Nunc ornare rhoncus augue, commodo finibus nisi fermentum nec. Mauris et consequat leo. Nullam vel turpis est. Phasellus fermentum, dui nec lobortis rutrum, mi orci pretium ex, eget pellentesque ligula magna non mauris. Aliquam aliquam lectus quis sem condimentum, sit amet aliquam nulla venenatis. Etiam congue sollicitudin orci, ut eleifend urna tristique sit amet.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          delivery_id: '2',
          description:
            'Nunc ornare rhoncus augue, commodo finibus nisi fermentum nec. Mauris et consequat leo. Nullam vel turpis est. Phasellus fermentum, dui nec lobortis rutrum, mi orci pretium ex, eget pellentesque ligula magna non mauris. Aliquam aliquam lectus quis sem condimentum, sit amet aliquam nulla venenatis. Etiam congue sollicitudin orci, ut eleifend urna tristique sit amet.',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

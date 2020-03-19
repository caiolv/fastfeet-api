import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { courier, recipient, adressStreet, address } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: courier.email,
      subject: 'Nova entrega cadastrada',
      template: 'new_delivery',
      context: {
        courier: courier.name,
        recipient: recipient.name,
        address: `${adressStreet} - ${address}`,
      },
    });
  }
}

export default new NewDeliveryMail();

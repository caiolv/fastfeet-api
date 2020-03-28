import Mail from '../../lib/Mail';

class DeliveryCanceledMail {
  get key() {
    return 'DeliveryCanceledMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: delivery.courier.email,
      subject: 'Entrega cancelada',
      template: 'delivery_canceled',
      context: {
        delivery_id: delivery.id,
        courier: delivery.courier.name,
        recipient: delivery.recipient.name,
        product: delivery.product,
      },
    });
  }
}

export default new DeliveryCanceledMail();

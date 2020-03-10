import * as Yup from 'yup';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
// import File from '../models/File';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      start_date: Yup.date().required(),
      // end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { product, start_date, recipient_id, courier_id } = req.body;

    const courierExists = await Courier.findByPk(courier_id);

    if (!courierExists) {
      return res.status(400).json({ error: 'Courier does not exist.' });
    }

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const delivery = await Delivery.create({
      recipient_id,
      courier_id,
      product,
      start_date,
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();

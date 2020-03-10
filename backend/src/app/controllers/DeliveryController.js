import * as Yup from 'yup';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      // start_date: Yup.date().required(),
      // end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { product, recipient_id, courier_id } = req.body;

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
    });

    return res.json(delivery);
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     name: Yup.string(),
  //     email: Yup.string().email(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validation fails' });
  //   }

  //   const { email } = req.body;
  //   const { id } = req.params;

  //   const courier = await Courier.findByPk(req.id);

  //   if (!courier) {
  //     return res.status(400).json({ error: "Courier doesn't exist." });
  //   }

  //   if (email && email !== courier.email) {
  //     const courierExists = await Courier.findOne({
  //       where: { email },
  //     });

  //     if (courierExists) {
  //       return res
  //         .status(400)
  //         .json({ error: 'Courier with this e-mail already exists.' });
  //     }
  //   }

  //   const hourStart = startOfHour(parseISO(start_date));

  //   if (isBefore(hourStart, new Date())) {
  //     return res.status(400).json({ error: 'Past dates are not permitted.' });
  //   }

  //   const { name } = await courier.update(req.body);

  //   return res.json({
  //     id,
  //     name,
  //     email,
  //   });
  // }

  // async delete(req, res) {
  //   const { id } = req.params;
  //   const courier = await Courier.findByPk(id);

  //   if (!courier) {
  //     return res.status(400).json({ error: 'Courier does not exist. ' });
  //   }

  //   await courier.destroy();

  //   return res.json(courier);
  // }
}

export default new DeliveryController();

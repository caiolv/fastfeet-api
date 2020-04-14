import * as Yup from 'yup';
import Sequelize, { Op } from 'sequelize';
import {
  startOfHour,
  isWithinInterval,
  setHours,
  parseISO,
  isBefore,
  startOfDay,
} from 'date-fns';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page = 1, search = '' } = req.query;
    const perPage = 5;

    const searchLower = search.toLowerCase();

    const deliveries = await Delivery.findAll({
      where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('product')), {
        [Op.like]: `%${searchLower}%`,
      }),
      // {
      //   product: {
      //     [Op.like]: `%${q}%`,
      //   },
      // },
      order: ['id'],
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: ['id', 'product', 'status'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'state', 'city', 'cep'],
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

    const address = `${recipientExists.city}, ${recipientExists.state}`;
    const adressStreet = `${recipientExists.street}`;

    await Queue.add(NewDeliveryMail.key, {
      courier: courierExists,
      recipient: recipientExists,
      adressStreet,
      address,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      courier_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, courier_id, signature_id } = req.body;

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exist." });
    }

    if (courier_id) {
      const courierExists = await Courier.findByPk(courier_id);

      if (!courierExists) {
        return res.status(400).json({ error: 'Courier does not exist.' });
      }
    }

    if (recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exist.' });
      }
    }

    const deliverUpdated = await delivery.update(req.body);

    return res.json(deliverUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist. ' });
    }

    const deliverUpdated = await delivery.update({
      canceled_at: new Date(),
    });

    // await delivery.destroy();

    return res.json(deliverUpdated);
  }
}

export default new DeliveryController();

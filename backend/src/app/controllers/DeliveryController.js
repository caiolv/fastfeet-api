import * as Yup from 'yup';
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

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
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

    const {
      product,
      recipient_id,
      courier_id,
      start_date,
      end_date,
      signature_id,
    } = req.body;

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

    if (start_date) {
      const deliveryRegistry = parseISO(delivery.created_at);
      const startDate = parseISO(start_date);
      const currentDate = startOfDay(startDate);

      if (isBefore(startDate, deliveryRegistry)) {
        return res.status(400).json({ error: 'Past dates are not permitted.' });
      }

      if (
        !isWithinInterval(startDate, {
          start: setHours(currentDate, 8),
          end: setHours(currentDate, 18),
        })
      )
        return res.status(401).json({
          error:
            'You can only withdraw the deliveries between 08:00h and 18:00h',
        });
    }

    if (end_date) {
      const deliveryRegistry = parseISO(delivery.created_at);
      const endDate = parseISO(end_date);

      if (isBefore(endDate, deliveryRegistry)) {
        return res.status(400).json({ error: 'Past dates are not permitted.' });
      }
    }

    if (signature_id) {
      const signatureExists = await File.findByPk(signature_id);

      if (!signatureExists) {
        return res
          .status(400)
          .json({ error: 'Informed file for signature does not exist.' });
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

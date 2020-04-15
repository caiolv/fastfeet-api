import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  isWithinInterval,
  parseISO,
  isBefore,
  setHours,
} from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class DeliveryStatusController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, end_date } = req.body;
    const { id } = req.params;
    let status = 'PENDENTE';

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exist." });
    }

    if (start_date) {
      const startDate = parseISO(start_date);
      const currentDate = startOfDay(startDate);
      const pickups_today = await Delivery.findAll({
        attributes: ['id', 'start_date'],
        where: {
          courier_id: delivery.courier_id,
          start_date: {
            [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
          },
        },
      });

      if (isBefore(startDate, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted.' });
      }
      if (pickups_today.length > 4) {
        return res
          .status(400)
          .json({ error: 'You can only pick up 5 deliveries a day.' });
      }

      if (
        !isWithinInterval(startDate, {
          start: setHours(currentDate, 8),
          end: setHours(currentDate, 18),
        })
      )
        return res.status(401).json({
          error: 'You can only withdraw deliveries between 08:00h and 18:00h',
        });

      status = 'RETIRADA';
    }

    if (end_date) {
      const endDate = parseISO(end_date);
      if (isBefore(endDate, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted.' });
      }
      status = 'ENTREGUE';
    }

    const deliveryResponse = await delivery.update({
      ...req.body,
      status,
    });

    return res.json(deliveryResponse);
  }
}

export default new DeliveryStatusController();

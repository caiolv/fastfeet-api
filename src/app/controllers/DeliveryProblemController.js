import * as Yup from 'yup';
import Sequelize, { Op } from 'sequelize';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Courier from '../models/Courier';
import Recipient from '../models/Recipient';

import DeliveryCanceledMail from '../jobs/DeliveryCanceledMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1, search = '' } = req.query;
    const perPage = 5;

    const searchLower = search.toLowerCase();

    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description'],
      order: ['id'],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
          where: Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('product')),
            {
              [Op.like]: `%${searchLower}%`,
            }
          ),
        },
      ],
    });

    return res.json(problems);
  }

  async show(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.id,
      },
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product'],
        },
      ],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { description } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exist." });
    }

    await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json({
      delivery_id: id,
      description,
    });
  }

  async delete(req, res) {
    const { id: problem_id } = req.params;

    const problem = await DeliveryProblem.findByPk(problem_id);

    if (!problem) {
      return res.status(400).json({ error: "Problem doesn't exist." });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    const deliverUpdated = await delivery.update({
      canceled_at: new Date(),
    });

    await Queue.add(DeliveryCanceledMail.key, {
      delivery,
    });
    // courier: delivery.courier.name,
    // recipient: delivery.recipient.name,
    // product: delivery.product,

    return res.json(deliverUpdated);
  }
}

export default new DeliveryProblemController();

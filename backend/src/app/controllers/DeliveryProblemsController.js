import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async index(req, res) {
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

  async delete(req, res) {}
}

export default new DeliveryProblemsController();

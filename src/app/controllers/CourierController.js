import * as Yup from 'yup';
import { Op } from 'sequelize';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async index(req, res) {
    const { page = 1, search = '' } = req.query;
    const perPage = 5;

    const couriers = await Courier.findAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: ['id'],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(couriers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const courierExists = await Courier.findOne({
      where: { email: req.body.email },
    });

    if (courierExists) {
      return res
        .status(400)
        .json({ error: 'Courier with this e-mail already exists.' });
    }

    const { id, name, email } = await Courier.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const { id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: "Courier doesn't exist." });
    }

    if (email && email !== courier.email) {
      const courierExists = await Courier.findOne({
        where: { email },
      });

      if (courierExists) {
        return res
          .status(400)
          .json({ error: 'Courier with this e-mail already exists.' });
      }
    }

    const { name } = await courier.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier does not exist. ' });
    }

    await courier.destroy();

    return res.json(courier);
  }

  async show(req, res) {
    const { id } = req.params;
    const courier = await Courier.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatar_id'],
    });

    if (!courier) {
      return res.status(400).json({ error: 'Courier does not exist. ' });
    }

    return res.json(courier);
  }
}

export default new CourierController();

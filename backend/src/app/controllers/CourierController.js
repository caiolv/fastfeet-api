import * as Yup from 'yup';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async index(req, res) {
    const couriers = await Courier.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
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

    const courier = await Courier.findByPk(req.id);

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
}

export default new CourierController();

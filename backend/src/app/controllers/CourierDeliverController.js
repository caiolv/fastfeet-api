import * as Yup from 'yup';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class CourierDeliverController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'start_date'],
      where: {
        courier_id: req.params.id,
        end_date: null,
        canceled_at: null,
      },
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
      ],
    });

    return res.json(deliveries);
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

  async delete(req, res) {
    const { id } = req.params;
    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier does not exist. ' });
    }

    await courier.destroy();

    return res.json(courier);
  }
}

export default new CourierDeliverController();

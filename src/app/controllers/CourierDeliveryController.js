import { Op } from 'sequelize';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class CourierDeliveryController {
  async index(req, res) {
    const { page = 1, delivered = false } = req.query;
    const perPage = 5;
    console.log(delivered);
    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'status', 'created_at', 'end_date'],
      where: {
        end_date:
          delivered === 'true'
            ? {
                [Op.not]: null,
              }
            : null,
      },
      order: ['id'],
      limit: perPage,
      offset: (page - 1) * perPage,
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
}

export default new CourierDeliveryController();

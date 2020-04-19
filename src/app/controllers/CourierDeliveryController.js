import { Op } from 'sequelize';
import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class CourierDeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1, delivered = false } = req.query;
    const perPage = 5;

    const deliveredBoolean = JSON.parse(delivered);

    const deliveries = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'status',
        'created_at',
        'start_date',
        'end_date',
      ],
      where: {
        end_date: deliveredBoolean ? { [Op.not]: null } : null,
        courier_id: id,
        canceled_at: null,
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

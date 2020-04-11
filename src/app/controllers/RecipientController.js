import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { cep } = req.body;

    const recipient = await Recipient.findOne({ where: { cep } });

    if (recipient) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
    } = await Recipient.create(req.body);

    return res.json({
      user: {
        id,
        name,
        cep,
        street,
        number,
        complement,
        state,
        city,
      },
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { cep: newCep } = req.body;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient doens`t exists.' });
    }

    if (newCep && newCep !== recipient.cep) {
      const existsRecipient = await Recipient.findOne({
        where: { cep: newCep },
      });

      if (existsRecipient) {
        return res
          .status(400)
          .json({ error: 'Recipient with this cep already exists.' });
      }
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
    } = await recipient.update(req.body);

    return res.json({
      user: {
        id,
        name,
        cep: newCep,
        street,
        number,
        complement,
        state,
        city,
      },
    });
  }
}

export default new RecipientController();

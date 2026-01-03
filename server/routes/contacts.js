const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ contacts });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    const errors = {};
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName) errors.name = 'Name is required';
    if (!trimmedEmail) errors.email = 'Email is required';
    if (trimmedEmail && !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      errors.email = 'Invalid email format';
    }
    if (!trimmedPhone) errors.phone = 'Phone is required';
    if (trimmedMessage && trimmedMessage.length > 200) {
      errors.message = 'Message must be 200 characters or less';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await Contact.findOne({
      $or: [{ email: trimmedEmail.toLowerCase() }, { phone: trimmedPhone }],
    }).lean();

    if (existing) {
      const conflictErrors = {};
      if ((existing.email || '').toLowerCase() === trimmedEmail.toLowerCase()) {
        conflictErrors.email = 'Email already exists';
      }
      if ((existing.phone || '') === trimmedPhone) {
        conflictErrors.phone = 'Phone already exists';
      }

      return res
        .status(409)
        .json({ message: 'Duplicate contact', errors: conflictErrors });
    }

    const created = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      message: trimmedMessage,
    });

    return res.status(201).json({ message: 'Contact created', contact: created });
  } catch (err) {
    if (err && err.code === 11000) {
      const dupErrors = {};
      if (err.keyPattern?.email) dupErrors.email = 'Email already exists';
      if (err.keyPattern?.phone) dupErrors.phone = 'Phone already exists';
      return res.status(409).json({ message: 'Duplicate contact', errors: dupErrors });
    }

    return res.status(500).json({ message: 'Failed to create contact' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    return res.status(200).json({ message: 'Contact deleted', id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete contact' });
  }
});

module.exports = router;

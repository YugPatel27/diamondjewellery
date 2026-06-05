import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { config } from '../config/config.js';
import { logActivity } from './activityController.js';

const normalizeDateOnly = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
};

export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, message } = req.body;
    let userId;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        userId = decoded.userId;
      } catch (error) {
        userId = undefined;
      }
    }

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const normalizedDate = normalizeDateOnly(date);
    if (!normalizedDate) {
      return res.status(400).json({ success: false, message: 'Invalid appointment date' });
    }

    const existingBooking = await Appointment.findOne({
      date: normalizedDate,
      time,
      status: { $ne: 'cancelled' }
    }).select('_id');

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked. Please choose another time.'
      });
    }

    const appointment = new Appointment({
      userId: userId || undefined,
      name,
      email,
      phone,
      date: normalizedDate,
      time,
      message
    });

    await appointment.save();
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { appointments: appointment._id } });
    }

    await logActivity(userId, 'Appointment Booked', `Appointment booked for ${name} on ${date} at ${time}`, 'Appointment', appointment._id, req);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked. Please choose another time.'
      });
    }
    res.status(500).json({ success: false, message: 'Failed to book appointment' });
  }
};

export const getBookedSlotsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const normalizedDate = normalizeDateOnly(date);
    if (!normalizedDate) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    const appointments = await Appointment.find({
      date: normalizedDate,
      status: { $ne: 'cancelled' }
    }).select('time status');

    const slots = appointments.map((item) => item.time);
    res.json({ success: true, date, slots, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booked slots' });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phone')
      .sort({ date: 1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await User.findByIdAndUpdate(appointment.userId, { $pull: { appointments: appointment._id } });

    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
};

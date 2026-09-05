import CreativeProcess from '../models/CreativeProcess.js';
import Artwork from '../models/Artwork.js';

export const createProcess = async (req, res, next) => {
  try {
    const { artworkId, inspiration, techniques, workflowSteps, creativeNotes, lessonsLearned } = req.body;

    // Check if artwork exists and user is owner
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }
    if (artwork.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add process to this artwork' });
    }

    // Check if process already exists
    const existingProcess = await CreativeProcess.findOne({ artwork: artworkId });
    if (existingProcess) {
      return res.status(400).json({ success: false, message: 'Process already exists for this artwork. Use PUT to update.' });
    }

    const process = await CreativeProcess.create({
      artwork: artworkId,
      creator: req.user.id,
      inspiration,
      techniques,
      workflowSteps,
      creativeNotes,
      lessonsLearned,
    });

    res.status(201).json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

export const getProcessByArtworkId = async (req, res, next) => {
  try {
    const process = await CreativeProcess.findOne({ artwork: req.params.artworkId });

    if (!process) {
      return res.status(404).json({ success: false, message: 'Process not found for this artwork' });
    }

    res.status(200).json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProcess = async (req, res, next) => {
  try {
    let process = await CreativeProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({ success: false, message: 'Process not found' });
    }

    if (process.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this process' });
    }

    process = await CreativeProcess.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProcess = async (req, res, next) => {
  try {
    const process = await CreativeProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({ success: false, message: 'Process not found' });
    }

    if (process.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this process' });
    }

    await process.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

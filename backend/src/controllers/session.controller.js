import LiveSession from '../models/LiveSession.js';

// @desc    Create a new live session
// @route   POST /api/sessions
// @access  Private (Creator/Admin)
export const createSession = async (req, res, next) => {
  try {
    const { title, description, scheduledStartTime } = req.body;

    const session = await LiveSession.create({
      title,
      description,
      scheduledStartTime,
      host: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all live/scheduled sessions
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await LiveSession.find({ status: { $ne: 'ended' } })
      .populate('host', 'name profilePicture username')
      .sort({ scheduledStartTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res, next) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .populate('host', 'name profilePicture username')
      .populate('participants', 'name profilePicture username');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session details
// @route   PUT /api/sessions/:id
// @access  Private (Host/Admin)
export const updateSession = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    let session = await LiveSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check ownership
    if (session.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this session' });
    }

    // Prevent changing host maliciously
    const updates = { title, description, status };
    if (status === 'live' && session.status !== 'live') {
      updates.actualStartTime = Date.now();
    } else if (status === 'ended' && session.status !== 'ended') {
      updates.endTime = Date.now();
    }

    session = await LiveSession.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Host/Admin)
export const deleteSession = async (req, res, next) => {
  try {
    const session = await LiveSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check ownership
    if (session.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this session' });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};


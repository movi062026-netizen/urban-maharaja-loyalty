const authService = require('../services/auth.service');
const { auditContext } = require('../services/audit.service');
const { success } = require('../utils/response');

const guestRequestOtp = async (req, res, next) => {
  try {
    const identifier = req.body.email || req.body;
    const result = await authService.guestRequestOtp(identifier);
    success(res, result, result.message || 'OTP dispatched');
  } catch (error) {
    next(error);
  }
};

const customerRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await authService.customerRegister({ name, email, phone, password });
    success(res, result, result.message || 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

const guestPasswordLogin = async (req, res, next) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.phone;
    const result = await authService.guestPasswordLogin(
      identifier,
      req.body.password,
      auditContext(req)
    );
    success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const guestVerifyOtp = async (req, res, next) => {
  try {
    const identifier = req.body.email || req.body;
    const result = await authService.guestVerifyOtp(
      identifier,
      req.body.otp,
      auditContext(req)
    );
    success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const result = await authService.adminLogin(
      req.body.email,
      req.body.password,
      auditContext(req)
    );
    success(res, result, 'Administrator authentication successful');
  } catch (error) {
    next(error);
  }
};

const staffLogin = async (req, res, next) => {
  try {
    const result = await authService.staffLogin(
      req.body.email,
      req.body.password,
      auditContext(req)
    );
    success(res, result, 'Staff authentication successful');
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const idToken = req.body.idToken || req.body.credential || req.body.token;
    const result = await authService.googleLogin(
      idToken,
      auditContext(req)
    );
    success(res, result, result.isNewUser ? 'Welcome to Urban Maharaja! Account created.' : 'Welcome back to Urban Maharaja!');
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    success(res, result, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    success(res, null, 'Logged out');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    success(res, { user }, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateGuestProfile(req.user.id, req.body);
    success(res, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email, auditContext(req));
    success(res, result, result.message || 'Password reset seal dispatched');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword({ email, otp, newPassword }, auditContext(req));
    success(res, result, result.message || 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  guestRequestOtp,
  customerRegister,
  guestVerifyOtp,
  guestPasswordLogin,
  adminLogin,
  staffLogin,
  googleLogin,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};



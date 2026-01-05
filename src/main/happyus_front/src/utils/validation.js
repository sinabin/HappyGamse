/**
 * Validation Utility Module
 *
 * This module contains regex patterns and validation functions
 * migrated from static/js/common.js to support React components.
 */

// Validation Regular Expressions
export const ValidationRegex = {
  userId: /^[A-Za-z0-9]{6,25}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()\-=+])[A-Za-z\d@$!%*?&#()\-=+]{10,}$/,
  birthDate: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
  phoneNumber: /^[0-9]{10,11}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  nickname: /^[가-힣A-Za-z0-9]{2,20}$/
};

// Error Messages for each validation field
export const ErrorMessages = {
  userId: {
    required: '아이디를 입력해주세요.',
    invalid: '아이디는 6~25자의 영문, 숫자만 가능합니다.',
    duplicate: '이미 사용 중인 아이디입니다.'
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    invalid: '비밀번호는 10자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    mismatch: '비밀번호가 일치하지 않습니다.'
  },
  email: {
    required: '이메일을 입력해주세요.',
    invalid: '올바른 이메일 형식이 아닙니다.'
  },
  phoneNumber: {
    required: '전화번호를 입력해주세요.',
    invalid: '전화번호는 10~11자리 숫자만 가능합니다.',
    notVerified: '전화번호 인증이 필요합니다.'
  },
  birthDate: {
    required: '생년월일을 입력해주세요.',
    invalid: '올바른 날짜 형식(YYYY-MM-DD)이 아닙니다.'
  },
  nickname: {
    required: '닉네임을 입력해주세요.',
    invalid: '닉네임은 2~20자의 한글, 영문, 숫자만 가능합니다.'
  },
  verificationCode: {
    required: '인증번호를 입력해주세요.',
    invalid: '인증번호가 올바르지 않습니다.'
  }
};

/**
 * Validates a field value against its regex pattern
 * @param {string} field - The field name (userId, password, email, etc.)
 * @param {string} value - The value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateField = (field, value) => {
  if (!value || value.trim() === '') {
    return false;
  }

  const regex = ValidationRegex[field];
  if (!regex) {
    console.warn(`No validation regex found for field: ${field}`);
    return true; // If no regex defined, consider it valid
  }

  return regex.test(value);
};

/**
 * Validates a field and returns error message if invalid
 * @param {string} field - The field name
 * @param {string} value - The value to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export const getValidationError = (field, value) => {
  if (!value || value.trim() === '') {
    return ErrorMessages[field]?.required || '필수 입력 항목입니다.';
  }

  if (!validateField(field, value)) {
    return ErrorMessages[field]?.invalid || '입력 형식이 올바르지 않습니다.';
  }

  return null;
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} passwordConfirm - Password confirmation
 * @returns {string|null} Error message if mismatch, null if match
 */
export const validatePasswordMatch = (password, passwordConfirm) => {
  if (!passwordConfirm || passwordConfirm.trim() === '') {
    return '비밀번호 확인을 입력해주세요.';
  }

  if (password !== passwordConfirm) {
    return ErrorMessages.password.mismatch;
  }

  return null;
};

/**
 * Calculates password strength (0-4)
 * @param {string} password - Password to evaluate
 * @returns {number} Strength score (0: very weak, 4: very strong)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 10) strength++;
  if (password.length >= 15) strength++;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&#()\-=+]/.test(password)) strength++;

  return Math.min(strength, 4);
};

/**
 * Validates multiple fields at once
 * @param {Object} formData - Object with field names as keys and values
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach(field => {
    const error = getValidationError(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  // Special case: password confirmation
  if (requiredFields.includes('password') && formData.passwordConfirm) {
    const matchError = validatePasswordMatch(formData.password, formData.passwordConfirm);
    if (matchError) {
      errors.passwordConfirm = matchError;
    }
  }

  return errors;
};

/**
 * Checks if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean} True if there are errors, false otherwise
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

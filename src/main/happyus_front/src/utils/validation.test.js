/**
 * Unit Tests for Validation Utility
 */

import {
  ValidationRegex,
  ErrorMessages,
  validateField,
  getValidationError,
  validatePasswordMatch,
  getPasswordStrength,
  validateForm,
  hasErrors
} from './validation';

describe('ValidationRegex', () => {
  test('userId regex accepts valid user IDs', () => {
    expect(ValidationRegex.userId.test('user123')).toBe(true);
    expect(ValidationRegex.userId.test('TestUser')).toBe(true);
    expect(ValidationRegex.userId.test('abc123def')).toBe(true);
  });

  test('userId regex rejects invalid user IDs', () => {
    expect(ValidationRegex.userId.test('abc')).toBe(false); // too short
    expect(ValidationRegex.userId.test('a'.repeat(26))).toBe(false); // too long
    expect(ValidationRegex.userId.test('user@123')).toBe(false); // special char
    expect(ValidationRegex.userId.test('사용자123')).toBe(false); // Korean
  });

  test('password regex accepts valid passwords', () => {
    expect(ValidationRegex.password.test('Abcdef1234!')).toBe(true);
    expect(ValidationRegex.password.test('MyP@ssw0rd')).toBe(true);
    expect(ValidationRegex.password.test('Test123!@#')).toBe(true);
  });

  test('password regex rejects invalid passwords', () => {
    expect(ValidationRegex.password.test('short1!')).toBe(false); // too short
    expect(ValidationRegex.password.test('alllowercase123!')).toBe(false); // no uppercase
    expect(ValidationRegex.password.test('ALLUPPERCASE123!')).toBe(false); // no lowercase
    expect(ValidationRegex.password.test('NoNumbers!')).toBe(false); // no digit
    expect(ValidationRegex.password.test('NoSpecial123')).toBe(false); // no special char
  });

  test('email regex accepts valid emails', () => {
    expect(ValidationRegex.email.test('test@example.com')).toBe(true);
    expect(ValidationRegex.email.test('user.name@domain.co.kr')).toBe(true);
    expect(ValidationRegex.email.test('user+tag@gmail.com')).toBe(true);
  });

  test('email regex rejects invalid emails', () => {
    expect(ValidationRegex.email.test('invalid')).toBe(false);
    expect(ValidationRegex.email.test('no@domain')).toBe(false);
    expect(ValidationRegex.email.test('@example.com')).toBe(false);
  });

  test('phoneNumber regex accepts valid phone numbers', () => {
    expect(ValidationRegex.phoneNumber.test('01012345678')).toBe(true);
    expect(ValidationRegex.phoneNumber.test('0212345678')).toBe(true);
  });

  test('phoneNumber regex rejects invalid phone numbers', () => {
    expect(ValidationRegex.phoneNumber.test('123')).toBe(false); // too short
    expect(ValidationRegex.phoneNumber.test('010-1234-5678')).toBe(false); // hyphens
    expect(ValidationRegex.phoneNumber.test('01012345678901')).toBe(false); // too long
  });

  test('birthDate regex accepts valid dates', () => {
    expect(ValidationRegex.birthDate.test('1990-01-01')).toBe(true);
    expect(ValidationRegex.birthDate.test('2000-12-31')).toBe(true);
  });

  test('birthDate regex rejects invalid dates', () => {
    expect(ValidationRegex.birthDate.test('1990/01/01')).toBe(false); // slashes
    expect(ValidationRegex.birthDate.test('90-01-01')).toBe(false); // 2-digit year
    expect(ValidationRegex.birthDate.test('1990-1-1')).toBe(false); // no padding
  });

  test('nickname regex accepts valid nicknames', () => {
    expect(ValidationRegex.nickname.test('닉네임')).toBe(true);
    expect(ValidationRegex.nickname.test('Nickname')).toBe(true);
    expect(ValidationRegex.nickname.test('닉네임123')).toBe(true);
  });

  test('nickname regex rejects invalid nicknames', () => {
    expect(ValidationRegex.nickname.test('a')).toBe(false); // too short
    expect(ValidationRegex.nickname.test('a'.repeat(21))).toBe(false); // too long
    expect(ValidationRegex.nickname.test('nick@name')).toBe(false); // special char
  });
});

describe('validateField', () => {
  test('returns true for valid values', () => {
    expect(validateField('userId', 'user123')).toBe(true);
    expect(validateField('email', 'test@example.com')).toBe(true);
  });

  test('returns false for invalid values', () => {
    expect(validateField('userId', 'abc')).toBe(false);
    expect(validateField('email', 'invalid')).toBe(false);
  });

  test('returns false for empty values', () => {
    expect(validateField('userId', '')).toBe(false);
    expect(validateField('userId', '   ')).toBe(false);
  });

  test('returns true for unknown fields (no regex)', () => {
    expect(validateField('unknownField', 'anyValue')).toBe(true);
  });
});

describe('getValidationError', () => {
  test('returns required error for empty values', () => {
    expect(getValidationError('userId', '')).toBe(ErrorMessages.userId.required);
    expect(getValidationError('email', '   ')).toBe(ErrorMessages.email.required);
  });

  test('returns invalid error for invalid values', () => {
    expect(getValidationError('userId', 'abc')).toBe(ErrorMessages.userId.invalid);
    expect(getValidationError('email', 'invalid')).toBe(ErrorMessages.email.invalid);
  });

  test('returns null for valid values', () => {
    expect(getValidationError('userId', 'user123')).toBeNull();
    expect(getValidationError('email', 'test@example.com')).toBeNull();
  });
});

describe('validatePasswordMatch', () => {
  test('returns null when passwords match', () => {
    expect(validatePasswordMatch('Test123!@#', 'Test123!@#')).toBeNull();
  });

  test('returns error when passwords do not match', () => {
    expect(validatePasswordMatch('Test123!@#', 'Different123!')).toBe(ErrorMessages.password.mismatch);
  });

  test('returns error when confirmation is empty', () => {
    expect(validatePasswordMatch('Test123!@#', '')).toBeTruthy();
  });
});

describe('getPasswordStrength', () => {
  test('returns 0 for empty password', () => {
    expect(getPasswordStrength('')).toBe(0);
    expect(getPasswordStrength(null)).toBe(0);
  });

  test('returns low strength for weak passwords', () => {
    expect(getPasswordStrength('short')).toBeLessThan(3);
  });

  test('returns high strength for strong passwords', () => {
    const strength = getPasswordStrength('VeryStrong123!@#');
    expect(strength).toBeGreaterThanOrEqual(3);
  });

  test('strength increases with length', () => {
    const short = getPasswordStrength('Test123!');
    const long = getPasswordStrength('VeryLongPassword123!');
    expect(long).toBeGreaterThanOrEqual(short);
  });
});

describe('validateForm', () => {
  test('returns empty object for valid form', () => {
    const formData = {
      userId: 'user123',
      email: 'test@example.com',
      phoneNumber: '01012345678'
    };
    const errors = validateForm(formData, ['userId', 'email', 'phoneNumber']);
    expect(hasErrors(errors)).toBe(false);
  });

  test('returns errors for invalid fields', () => {
    const formData = {
      userId: 'abc', // too short
      email: 'invalid',
      phoneNumber: '123' // too short
    };
    const errors = validateForm(formData, ['userId', 'email', 'phoneNumber']);
    expect(hasErrors(errors)).toBe(true);
    expect(errors.userId).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phoneNumber).toBeTruthy();
  });

  test('validates password confirmation', () => {
    const formData = {
      password: 'Test123!@#',
      passwordConfirm: 'Different123!'
    };
    const errors = validateForm(formData, ['password']);
    expect(errors.passwordConfirm).toBe(ErrorMessages.password.mismatch);
  });

  test('only validates required fields', () => {
    const formData = {
      userId: 'user123',
      email: 'invalid' // invalid but not required
    };
    const errors = validateForm(formData, ['userId']);
    expect(hasErrors(errors)).toBe(false);
  });
});

describe('hasErrors', () => {
  test('returns true when errors exist', () => {
    expect(hasErrors({ userId: 'error' })).toBe(true);
    expect(hasErrors({ field1: 'error1', field2: 'error2' })).toBe(true);
  });

  test('returns false when no errors', () => {
    expect(hasErrors({})).toBe(false);
  });
});

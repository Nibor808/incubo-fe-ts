import ValidateForm from './utils/validate_form';
import Contact from './components/Contact';
import { render } from '@testing-library/react';

test('renders the Contact Component', () => {
  render(<Contact />);
});

describe('Validates Form', () => {
  test('validateForm returns name error when no name present', () => {
    const errors = ValidateForm('', '', '', '');

    expect(errors.type).toEqual('name');
    expect(errors.msg).toEqual('But... what should I call you?');
  });

  test('validateForm returns email error when no email present', () => {
    const errors = ValidateForm('Mike DaRookie', '', '', '');

    expect(errors.type).toEqual('email');
    expect(errors.msg).toEqual('How about an email?');
  });

  test('validateForm returns email error when improperly formatted email passed', () => {
    const errors = ValidateForm('Mike DaRookie', 'test@test', '', '');

    expect(errors.type).toEqual('email');
    expect(errors.msg).toEqual("I don't think that one will work.");
  });

  test('validateForm returns message error when no message present', () => {
    const errors = ValidateForm('Mike DaRookie', 'test@test.ca', '', '');

    expect(errors.type).toEqual('message');
    expect(errors.msg).toEqual("Ok I'll guess. You want to talk about...");
  });

  test('validateForm returns captcha error when no captcha present', () => {
    const errors = ValidateForm('Mike DaRookie', 'test@test.ca', 'message', '');

    expect(errors.type).toEqual('captcha');
    expect(errors.msg).toEqual('Please check the captcha');
  });

  test('validateForm returns no errors with proper info passed', () => {
    const errors = ValidateForm(
      'Mike DaRookie',
      'test@test.ca',
      'message',
      'captchaString'
    );

    expect(errors.type).toEqual('');
    expect(errors.msg).toEqual('');
  });
});

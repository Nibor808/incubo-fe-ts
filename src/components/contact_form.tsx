import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';

interface ContactFormProps {
  sendMail: () => void;
  onChange: (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => void;
  errors: errors;
  borders: borders;
  showResponse: () => string;
  recaptchaRef:
    | string
    | ((instance: ReCAPTCHA | null) => void)
    | React.RefObject<ReCAPTCHA>
    | null
    | undefined;
  buttonText: string;
  buttonClicked: boolean;
}

type borders = {
  nameErrorBorder: string;
  emailErrorBorder: string;
  messageErrorBorder: string;
};

type errors = {
  nameError: string;
  emailError: string;
  messageError: string;
};

const ContactForm = (props: ContactFormProps) => {
  const {
    sendMail,
    onChange,
    errors,
    borders,
    showResponse,
    recaptchaRef,
    buttonText,
    buttonClicked,
  } = props;

  return (
    <div className='row' data-testid='email-form'>
      <div className='col-1 col-md-1 sidebar' />

      <div className='col-sm-8 col-lg-6'>
        <form onSubmit={sendMail} method='post' id='email-form'>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <span className='error'>{errors.nameError}</span>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              onChange={ev => onChange(ev, 'name')}
              style={{ border: borders.nameErrorBorder }}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <span className='error'>{errors.emailError}</span>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              onChange={ev => onChange(ev, 'name')}
              style={{ border: borders.emailErrorBorder }}
            />
            <small>Your information will never be shared. Full stop.</small>
          </div>

          <div className='form-group'>
            <label htmlFor='description'>Message</label>
            <span className='error'>{errors.messageError}</span>
            <textarea
              rows={3}
              className='form-control'
              id='message'
              name='message'
              onChange={ev => onChange(ev, 'name')}
              style={{ border: borders.messageErrorBorder }}
            />
          </div>

          <div className='send-div'>
            <button type='submit' disabled={buttonClicked}>
              {buttonText}
            </button>

            {showResponse()}
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            size='normal'
            sitekey='6LcNF-oUAAAAAEMyOzk5t1xUwJJgXSoVJfggilv2'
          />
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

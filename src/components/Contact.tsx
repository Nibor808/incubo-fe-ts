import React, { Suspense, useRef, useState } from 'react';
import validateForm from '../utils/validate_form';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import ErrorBoundary from './ErrorBoundary';

const ContactForm = React.lazy(() => import('./ContactForm'));

type Response = {
  data: {
    Type: string;
    Message: string;
  };
};

type MailInfo = {
  name: string;
  email: string;
  message: string;
  recaptchaValue: string;
};

export type FormError = {
  type: string;
  msg: string;
};

type Errors = {
  nameError: string;
  nameErrorBorder: string;
  emailError: string;
  emailErrorBorder: string;
  messageError: string;
  messageErrorBorder: string;
};

const Contact = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const ERROR_BORDER = '1px solid rgb(211, 0, 57)';
  const contactForm = document.getElementById(
    'contact-form'
  ) as HTMLFormElement;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<Response>({
    data: { Message: '', Type: '' },
  });
  const [errors, setErrors] = useState<Errors>({
    nameError: '',
    nameErrorBorder: '',
    emailError: '',
    emailErrorBorder: '',
    messageError: '',
    messageErrorBorder: '',
  });
  const [buttonClicked, setButtonClicked] = useState(false);

  const validateValues = (ev: React.FormEvent) => {
    ev.preventDefault();

    const recaptchaValue = recaptchaRef.current?.getValue();
    const formError: FormError = validateForm(name, email, message);

    if (formError) {
      switch (formError.type) {
        case 'name':
          return setErrors({
            ...errors,
            nameErrorBorder: ERROR_BORDER,
            nameError: formError.msg,
          });
        case 'email':
          return setErrors({
            ...errors,
            emailErrorBorder: ERROR_BORDER,
            emailError: formError.msg,
          });
        case 'message':
          return setErrors({
            ...errors,
            messageErrorBorder: ERROR_BORDER,
            messageError: formError.msg,
          });
        default:
        // Do Nothing
      }
    }

    if (!recaptchaValue) {
      return setResponse({
        data: {
          Type: 'error',
          Message: 'Please check the captcha',
        },
      });
    }

    setButtonClicked(true);
    setResponse({ data: { Message: '', Type: '' } });

    const info: MailInfo = {
      name,
      email,
      message,
      recaptchaValue,
    };

    sendMail(info);
  };

  const sendMail = async (info: MailInfo) => {
    try {
      const response = await axios.post('/api/sendmail', info);

      setResponse(response);
    } catch (err) {
      setResponse({
        data: {
          Type: 'error',
          Message: 'Oops! We broke it. Please try again later.',
        },
      });
    } finally {
      recaptchaRef.current?.reset();
      setButtonClicked(false);
      clearFormValues();

      setTimeout(() => {
        contactForm?.reset();
        setResponse({ data: { Message: '', Type: '' } });
      }, 3000);
    }
  };

  const showResponse = () => {
    let klass;

    if (response.data) {
      klass = response.data.Type === 'ok' ? 'success' : 'error';

      return <p className={klass}>{response.data.Message}</p>;
    }

    return null;
  };

  const clearError = () => {
    return setErrors({
      nameErrorBorder: '',
      nameError: '',
      emailErrorBorder: '',
      emailError: '',
      messageErrorBorder: '',
      messageError: '',
    });
  };

  const clearFormValues = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    if (type === 'name') setName(ev.target.value);
    else if (type === 'email') setEmail(ev.target.value);
    else if (type === 'message') setMessage(ev.target.value);

    clearError();
  };

  const buttonText = buttonClicked ? 'Sending...' : 'Send';

  return (
    <div data-testid='contact-div'>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <ContactForm
            validateValues={validateValues}
            onChange={handleChange}
            errors={{ ...errors }}
            showResponse={showResponse}
            recaptchaRef={recaptchaRef}
            buttonText={buttonText}
            buttonClicked={buttonClicked}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default Contact;

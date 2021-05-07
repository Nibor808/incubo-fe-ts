import React, { Suspense, useRef, useState } from 'react';
import validateForm from '../utils/validate_form';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactForm = React.lazy(() => import('./contact_form'));

type ResponseProps = {
  data: {
    Type: string;
    Message: string;
  };
};

const Contact = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const ERROR_BORDER = '1px solid rgb(211, 0, 57)';
  const contactForm = document.getElementById('contact-form');

  const [name, setName] = useState({});
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<ResponseProps>({
    data: { Message: '', Type: '' },
  });
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [nameErrorBorder, setNameErrorBorder] = useState('');
  const [emailErrorBorder, setEmailErrorBorder] = useState('');
  const [messageErrorBorder, setMessageErrorBorder] = useState('');

  const sendMail = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    const frmError = validateForm(name, email, message);

    if (frmError) {
      switch (frmError.type) {
        case 'name':
          setNameErrorBorder(ERROR_BORDER);
          return setNameError(frmError.msg);
        case 'email':
          setEmailErrorBorder(ERROR_BORDER);
          return setEmailError(frmError.msg);
        case 'message':
          setMessageErrorBorder(ERROR_BORDER);
          return setMessageError(frmError.msg);
        default:
          setNameErrorBorder('');
      }
    }

    const recaptchaValue = recaptchaRef.current?.getValue();

    if (!recaptchaValue) {
      return setResponse({
        data: {
          Type: 'error',
          Message: 'Please check the captcha',
        },
      });
    } else {
      setButtonClicked(true);
      setResponse({
        data: {
          Type: '',
          Message: '',
        },
      });

      const info = JSON.stringify({
        name,
        email,
        message,
        recaptchaValue,
      });

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
          if (contactForm instanceof HTMLFormElement) contactForm.reset();
          setResponse({
            data: {
              Type: '',
              Message: '',
            },
          });
        }, 3000);
      }
    }
  };

  const showResponse = () => {
    let klass;

    if (response.data) {
      response.data.Type === 'ok' ? (klass = 'success') : (klass = 'error');

      return <p className={klass}>{response.data.Message}</p>;
    }

    return null;
  };

  const clearError = () => {
    setNameError('');
    setEmailError('');
    setMessageError('');
    setNameErrorBorder('');
    setEmailErrorBorder('');
    setMessageErrorBorder('');
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
        <ContactForm
          sendMail={sendMail}
          onChange={handleChange}
          errors={{
            nameError,
            emailError,
            messageError,
          }}
          borders={{
            nameErrorBorder,
            emailErrorBorder,
            messageErrorBorder,
          }}
          showResponse={showResponse}
          recaptchaRef={recaptchaRef}
          buttonText={buttonText}
          buttonClicked={buttonClicked}
        />
      </Suspense>
    </div>
  );
};

export default Contact;

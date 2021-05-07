import React, { useRef, useState } from 'react';
import Header from './components/header';
import About from './components/about';
import Contact from './components/contact';
import PortfolioList from './components/portfolio_list';
import { list2016, list2017 } from './utils/portfolio_item_info';
import Modal from './components/Modal';

const App: React.FC = () => {
  const logoImg = document.getElementById('logo-img');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<React.MouseEvent<
    HTMLImageElement,
    MouseEvent
  > | null>(null);
  const portfolioRef = useRef<HTMLLinkElement | null>(null);
  const contactRef = useRef<HTMLLinkElement | null>(null);

  window.onscroll = () => {
    if (logoImg) {
      if (
        document.body.scrollTop > 30 ||
        document.documentElement.scrollTop > 30
      ) {
        logoImg.style.height = '80px';
        logoImg.style.width = '185px';
        logoImg.style.transition = '0.4s';
      } else {
        logoImg.style.height = '110px';
        logoImg.style.width = '258px';
      }
    }
  };

  const toPortfolio = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setTimeout(() => {
      portfolioRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 75);
  };

  const toContact = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setTimeout(() => {
      contactRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 75);
  };

  const handleClick = (ev: React.MouseEvent<HTMLImageElement>) => {
    setIsOpen(true);
    ev.persist();
    setEvent(ev);
  };

  const showModal = (): JSX.Element | null => {
    return isOpen ? (
      <span key='a1'>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          headerText={event?.currentTarget.dataset.text}
          srcText={event?.currentTarget.alt}
        />
      </span>
    ) : null;
  };

  return (
    <React.Fragment>
      {showModal()},
      <Header key='a2' toContact={toContact} toPortfolio={toPortfolio} />,
      <section key='a3' className='landing container'>
        <article className='about'>
          <div className='about-container'>
            <About />
          </div>
        </article>

        <article className='portfolio' ref={portfolioRef}>
          <div className='header-container'>
            <div className='row'>
              <div className='col-12'>
                <h1>Portfolio</h1>
                <a
                  href='https://github.com/Nibor808'
                  target='_blank'
                  rel='noopener noreferrer'
                  data-testid='github-link'
                >
                  github
                </a>
              </div>
            </div>
          </div>

          <div className='portfolio-container'>
            <PortfolioList
              year='2017'
              list={list2017}
              sideBarName='sidebar2017'
              handleClick={handleClick}
            />

            <PortfolioList
              data-testid='2016-list'
              year='2016'
              list={list2016}
              sideBarName='sidebar2016'
              handleClick={handleClick}
            />
          </div>
        </article>

        <article className='contact' ref={contactRef}>
          <div className='header-container'>
            <div className='row'>
              <div className='col-12'>
                <h1>Contact</h1>
                <p>Want to work together? Get in touch!</p>
              </div>
            </div>
          </div>

          <div className='contact-container'>
            <Contact />
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};

export default App;

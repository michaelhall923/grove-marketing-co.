import ContactForm from './ContactForm';
import ScrollShow from './ScrollShow';
import SpriteConstructionOctopus from './SpriteConstructionOctopus';
import SpriteConstructionSign from './SpriteConstructionSign';
import SpriteSeaFloor from './SpriteSeaFloor';

const Footer = ({ title }) => {
  const year = new Date().getFullYear();

  return (
    <>
      <div
        className="h-120 md:h-200"
        style={{ background: 'linear-gradient(to bottom, rgb(20, 52, 52), rgb(15, 38, 38))' }}
      >
        <div className="relative h-full">
          <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2">
            <SpriteSeaFloor />
          </div>
          <div className="absolute bottom-0 left-1/2 w-4/5 -translate-x-1/2 md:bottom-20 lg:w-150">
            <SpriteConstructionSign />
            <div
              className="absolute top-0 flex h-5/6 w-full flex-col justify-center px-5 py-6 text-center md:px-16 md:py-12"
              style={{ rotate: '1.5deg' }}
            >
              {/* <h2 className="text-2xl md:text-5xl md:mb-4">Site Under Construction</h2>
                    <p className="text-md md:text-3xl mb-4 md:mb-8 font-copy">We&apos;re still polishing shells and patching up coral – more info coming soon!</p>
                    <p className="text-xl md:text-3xl">
                      <Link to="tel:3177775858">(317) 777-5858</Link>
                    </p>
                    <p className="text-xl md:text-3xl">
                      <Link to="mailto:sales@grovemarketingco.com">sales@grovemarketingco.com</Link>
                    </p> */}
              <ContactForm title={title} />
            </div>
          </div>
          <div className="absolute -bottom-8 left-4 w-16 md:bottom-20 md:left-12 md:w-32 lg:left-1/4 lg:-translate-x-full">
            <ScrollShow>
              <SpriteConstructionOctopus />
            </ScrollShow>
          </div>
        </div>
      </div>
      <footer aria-labelledby="footer-heading" className="bg-[#0B1F1E] pt-8 text-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        {/* Bottom-centered insignia without absolute positioning */}
        <div
          className="mx-auto flex min-h-24 max-w-7xl items-end justify-center px-6"
          style={{
            paddingTop: '1.5rem',
            paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <p className="text-center text-sm leading-none text-white/70">
            <span aria-hidden="true">©</span> <time dateTime={String(year)}>{year}</time> Grove
            Marketing Co.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;

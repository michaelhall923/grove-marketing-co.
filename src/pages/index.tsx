// import Image from '@/lib/Image';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import ScrollShow from '@/components/ScrollShow';
import SpriteBoat from '@/components/SpriteBoat';
import SpriteDolphin from '@/components/SpriteDolphin';
import SpriteFish from '@/components/SpriteFish';
import SpriteJellyfish from '@/components/SpriteJellyfish';
import SpriteLighthouse from '@/components/SpriteLighthouse';
import SpriteOceanLeft from '@/components/SpriteOceanLeft';
import SpriteOceanRight from '@/components/SpriteOceanRight';
import SpriteOceanTop from '@/components/SpriteOceanTop';
import SpriteRocket from '@/components/SpriteRocket';
import SpriteSmoke from '@/components/SpriteSmoke';
import SpriteSun from '@/components/SpriteSun';
import SpriteSunRays from '@/components/SpriteSunRays';
import SpriteSurfer from '@/components/SpriteSurfer';
import SpriteWave from '@/components/SpriteWave';
import SpriteWaveBottom from '@/components/SpriteWaveBottom';
import TrustSection from '@/components/TrustSection';
import Image from '@/lib/Image';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="">
      <SEO title="Grove Marketing Co. | Digital Marketing, Web Development & SEO" />
      <HeaderFix />
      <main className="">
        <div className="mx-auto min-h-110 px-4 md:min-h-144 md:w-2xl lg:w-4xl lg:px-8">
          <h1 className="mb-8 w-60 text-right uppercase md:w-xs lg:w-xs">
            <div className="inline-block text-8xl leading-18 md:text-9xl md:leading-24">Grove</div>
            <div className="text-3xl">Marketing Co.</div>
          </h1>
          <p className="font-copy text-2xl md:w-2xl md:text-4xl lg:text-5xl">
            Building adventurous brands
            <br />
            from the Space Coast
          </p>
        </div>

        <div style={{ backgroundColor: '#194b51' }} className="">
          <div className="relative min-h-110 md:min-h-172 lg:min-h-232">
            <div className="absolute -top-38 left-0 w-32 md:-top-76 md:w-54 lg:w-64">
              <SpriteLighthouse />
            </div>
            <div className="absolute -top-40 right-18 w-20 md:-top-80 md:right-36 md:w-42 lg:right-60 lg:w-48">
              <SpriteSun />
            </div>
            <div className="absolute -top-28 right-0 w-32 md:-top-56 md:w-64 lg:right-14">
              <SpriteSmoke />
            </div>
            <div className="absolute -top-56 right-9 w-16 md:-top-112 md:right-18 md:w-32 lg:right-32">
              <SpriteRocket />
            </div>
            <div className="absolute -top-[4vw] left-1/2 w-screen -translate-x-1/2">
              <SpriteWave />
            </div>
            <div
              className="absolute top-0 h-100 w-screen"
              style={{ backgroundColor: '#194b51' }}
            ></div>
            <div className="absolute top-0 left-1/2 w-screen -translate-x-1/2">
              <SpriteOceanTop />
            </div>
            <div className="absolute top-0 bottom-0 w-screen overflow-x-hidden">
              <div className="absolute top-22 left-0 w-76 -translate-x-20 md:top-44 md:w-120 lg:top-64 lg:right-full lg:w-192 lg:-translate-x-20">
                <SpriteOceanLeft />
              </div>
              <div className="absolute top-48 right-0 w-76 translate-x-32 md:top-66 md:w-110 lg:top-88 lg:left-full lg:w-156 lg:-translate-x-128">
                <SpriteOceanRight />
              </div>
            </div>
            <div className="absolute -top-22 right-14 w-32 md:-top-48 md:right-44 md:w-64 lg:right-1/4">
              <SpriteBoat />
            </div>
            <div className="absolute -top-14 left-14 w-24 md:-top-40 md:left-16 md:w-48 lg:left-64 lg:w-64">
              <SpriteSurfer />
            </div>
            <div className="absolute top-32 left-1/2 w-full -translate-x-1/2 md:top-54 lg:top-76 lg:w-4xl">
              <h2 className="inline-block w-full px-4 text-center text-6xl leading-16 uppercase md:text-8xl md:leading-22 lg:px-32">
                Start Exploring
              </h2>
              <a href="#services">
                <div className="bg-grove-100 relative mx-auto mt-6 h-16 w-16 rounded-full md:h-32 md:w-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#287073"
                    className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 md:size-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div
          className="min-h-250 md:min-h-300 lg:min-h-300"
          style={{ background: 'linear-gradient(to bottom, rgb(16, 106, 108), rgb(8, 90, 98))' }}
        >
          <div className="relative">
            <div className="absolute top-0 left-1/2 w-272 max-w-full -translate-x-1/2">
              <SpriteSunRays />
            </div>
            <div className="absolute top-0 left-1/2 w-screen -translate-x-1/2 md:-top-1">
              <SpriteWaveBottom />
            </div>
            <div className="absolute top-36 -left-20 w-40 md:top-60 md:left-0 md:w-60 lg:left-12 lg:w-80">
              <ScrollShow>
                <SpriteDolphin />
              </ScrollShow>
            </div>
            <div className="absolute top-40 right-6 w-18 md:top-56 md:right-14 md:w-28 lg:right-24 lg:w-36">
              <ScrollShow>
                <SpriteJellyfish />
              </ScrollShow>
            </div>
            <ScrollShow>
              <div className="absolute top-44 w-screen scale-50 md:scale-100 lg:top-0">
                <div className="absolute top-40 left-1/4 w-20 md:left-1/2">
                  <SpriteFish />
                </div>
                <div className="absolute top-48 left-1/4 w-18 translate-x-16 md:left-1/2">
                  <SpriteFish />
                </div>
                <div className="absolute top-56 left-1/4 w-16 translate-x-4 md:left-1/2">
                  <SpriteFish />
                </div>
                <div className="absolute top-50 left-1/4 w-14 -translate-x-8 md:left-1/2">
                  <SpriteFish />
                </div>
                <div className="absolute top-36 left-1/4 w-12 translate-x-18 md:left-1/2">
                  <SpriteFish />
                </div>
              </div>
            </ScrollShow>

            <div
              id="services"
              className="absolute top-88 left-1/2 w-[calc(100%-32px)] -translate-x-1/2 rounded-4xl p-2 md:top-120 md:w-[calc(100%-64px)] lg:top-100 lg:w-xl"
              style={{ backgroundColor: '#4F8D8C' }}
            >
              <div className="rounded-3xl p-2" style={{ backgroundColor: '#255C67' }}>
                <div className="rounded-2xl p-2" style={{ backgroundColor: 'rgb(4,72,80)' }}>
                  <div className="relative">
                    <div className="pointer-events-none absolute h-full w-full">
                      <div
                        className="absolute top-0 left-0 inline-block rounded-full"
                        style={{ backgroundColor: '#255C67', padding: '2px' }}
                      >
                        <div className="rounded-full p-px" style={{ backgroundColor: '#6EA39E' }}>
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: '#4F8D8C' }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="absolute top-0 right-0 inline-block rounded-full"
                        style={{ backgroundColor: '#255C67', padding: '2px' }}
                      >
                        <div className="rounded-full p-px" style={{ backgroundColor: '#6EA39E' }}>
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: '#4F8D8C' }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 inline-block rounded-full"
                        style={{ backgroundColor: '#255C67', padding: '2px' }}
                      >
                        <div className="rounded-full p-px" style={{ backgroundColor: '#6EA39E' }}>
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: '#4F8D8C' }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="absolute right-0 bottom-0 inline-block rounded-full"
                        style={{ backgroundColor: '#255C67', padding: '2px' }}
                      >
                        <div className="rounded-full p-px" style={{ backgroundColor: '#6EA39E' }}>
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: '#4F8D8C' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <h2 className="mt-6 inline-block w-full text-center text-5xl leading-22 uppercase md:mb-4 md:text-7xl">
                      Our Services
                    </h2>
                    <div className="px-4 pb-4 text-lg leading-6 md:pb-8 md:text-2xl md:leading-8">
                      <div className="grid w-full grid-cols-2 grid-rows-2 gap-px gap-y-4 md:gap-y-8">
                        <Link to="/services/web-development">
                          <div>
                            <div
                              className="mx-auto mb-4 size-28 overflow-hidden rounded-full border-4 md:size-44 md:border-6"
                              style={{ borderColor: '#6EA39E' }}
                            >
                              <Image
                                className="scale-110"
                                src="/img/icon-web-development.svg"
                                alt="Web Development"
                                width={500}
                                height={500}
                                priority
                              />
                            </div>
                            <h3 className="text-center">Web Development</h3>
                          </div>
                        </Link>

                        <Link to="/services/integration-automation">
                          <div>
                            <div
                              className="mx-auto mb-4 size-28 overflow-hidden rounded-full border-4 md:size-44 md:border-6"
                              style={{ borderColor: '#6EA39E' }}
                            >
                              <Image
                                className="scale-110"
                                src="/img/icon-integration-automation.svg"
                                alt="Integration & Automation"
                                width={500}
                                height={500}
                                priority
                              />
                            </div>
                            <h3 className="text-center">Integration & Automation</h3>
                          </div>
                        </Link>

                        <Link to="/services/content-creation">
                          <div>
                            <div
                              className="mx-auto mb-4 size-28 overflow-hidden rounded-full border-4 md:size-44 md:border-6"
                              style={{ borderColor: '#6EA39E' }}
                            >
                              <Image
                                className="scale-110"
                                src="/img/icon-content-creation.svg"
                                alt="Content Creation"
                                width={500}
                                height={500}
                                priority
                              />
                            </div>
                            <h3 className="text-center">Content Creation</h3>
                          </div>
                        </Link>

                        <Link to="/services/advertising-seo">
                          <div>
                            <div
                              className="mx-auto mb-4 size-28 overflow-hidden rounded-full border-4 md:size-44 md:border-6"
                              style={{ borderColor: '#6EA39E' }}
                            >
                              <Image
                                className="scale-110"
                                src="/img/icon-advertising-seo.svg"
                                alt="Advertising & SEO"
                                width={500}
                                height={500}
                                priority
                              />
                            </div>
                            <h3 className="text-center">Advertising & SEO</h3>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TrustSection />
      </main>
    </div>
  );
}

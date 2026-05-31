const SpriteSunRays = () => {
    return (
      <svg className="w-full animate-sun-rays" viewBox="0 0 1057.29 554.99">
        <defs>
          <style>{`
            .sun-ray-1 {
              fill: url(#sun-ray-gradient-4);
            }

            .sun-ray-2 {
              fill: url(#sun-ray-gradient-3);
            }

            .sun-ray-3 {
              fill: url(#sun-ray-gradient-2);
            }

            .sun-ray-4 {
              fill: url(#sun-ray-gradient);
            }
          `}</style>
          <linearGradient id="sun-ray-gradient" x1="235.02" y1="0" x2="235.02" y2="554.99" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff" stop-opacity=".1"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="sun-ray-gradient-2" x1="434.48" x2="434.48" href="#sun-ray-gradient"/>
          <linearGradient id="sun-ray-gradient-3" x1="632.17" x2="632.17" href="#sun-ray-gradient"/>
          <linearGradient id="sun-ray-gradient-4" x1="900.33" x2="900.33" href="#sun-ray-gradient"/>
        </defs>
        <g id="Sun_Rays" data-name="Sun Rays">
          <polygon class="sun-ray-4" points="0 554.99 407.79 0 470.05 0 164.81 554.99 0 554.99"/>
          <polygon class="sun-ray-3" points="314.12 554.99 518.22 0 554.83 0 413.88 554.99 314.12 554.99"/>
          <polygon class="sun-ray-2" points="505.41 554.99 595.1 0 695.77 0 758.92 554.99 505.41 554.99"/>
          <polygon class="sun-ray-1" points="1057.29 554.99 806.52 0 743.37 0 900.33 554.99 1057.29 554.99"/>
        </g>
      </svg>
    );
  }
  
  export default SpriteSunRays;
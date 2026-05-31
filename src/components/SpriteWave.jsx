const SpriteWave = () => {
    return (
        <svg className="w-full animate-wave" viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
            <path d="
                M 0 10
                C 16.7 0, 33.3 20, 50 10
                C 66.7 0, 83.3 20, 100 10
                C 116.7 0, 133.3 20, 150 10
                C 166.7 0, 183.3 20, 200 10
                C 216.7 0, 233.3 20, 250 10
                C 266.7 0, 283.3 20, 300 10
                C 316.7 0, 333.3 20, 350 10
                C 366.7 0, 383.3 20, 400 10
                C 416.7 0, 433.3 20, 450 10
                C 466.7 0, 483.3 20, 500 10

                L 500 100
                L 0 100
                Z
            " fill="#287073" />
        </svg>

      
    );
  }
  
  export default SpriteWave;
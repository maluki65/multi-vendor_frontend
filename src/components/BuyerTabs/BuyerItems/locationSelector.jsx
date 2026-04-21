import React, { useState, useEffect, useRef } from 'react';

const counties = [
  'Mombasa',
  'Kwale',
  'Kilifi',
  'Tana River',
  'Lamu',
  'Taita-Taveta',
  'Garissa',
  'Wajir',
  'Mandera',
  'Marsabit',
  'Isiolo',
  'Meru',
  'Tharaka-Nithi',
  'Embu',
  'Kitui',
  'Machakos',
  'Makueni',
  'Nyandarua',
  'Nyeri',
  'Kirinyaga',
  "Murang'a",
  'Kiambu',
  'Turkana',
  'West Pokot',
  'Samburu',
  'Trans Nzoia',
  'Uasin Gishu',
  'Elgeyo-Marakwet',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Nakuru',
  'Narok',
  'Kajiado',
  'Kericho',
  'Bomet',
  'Kakamega',
  'Vihiga',
  'Bungoma',
  'Busia',
  'Siaya',
  'Kisumu',
  'Homa Bay',
  'Migori',
  'Kisii',
  'Nyamira',
  'Nairobi'
];

function LocationSelector({ location, setLocation }) {
  const [county, setCounty] = useState(location?.county || '');
  const [area, setArea] = useState(location?.area || '');
  const [open, setOpen] = useState(false);

  const dropDownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)){
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAppy = (e) => {
    e.preventDefault();
    if (!county) return;

    setLocation({ county, area });
  };

  return (
    <div className='  px-2 rounded-md space-y-3'>
      <h3 className='font-semibold text-dark'>
        Delivery Location
      </h3>

      <form 
        className='px-2 flex flex-col gap-3'
        onSubmit={handleAppy} >
          <div className='relative ml-2' ref={dropDownRef}>
            <button
              type='button'
              onClick={() => setOpen(!open)}
              className='w-full border px-3 py-2 rounded-lg text-left bg-white focus:outline-none focus:border-orange-400'
              >
                {county || 'select County'}
              </button>

              {open && (
                <ul className='absolute z-10 mt-1 w-full bg-white rounded-lg shadow max-h-[200px] overflow-auto locationSelect'>
                  {counties.map((c) => (
                    <li
                      key={c}
                      onClick={() => {
                        setCounty(c);
                        setOpen(false);
                      }}
                      className='px-3 py-2 cursor-pointer hover:bg-orange-100'>
                        {c}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          <input
            type='text'
            placeholder='Enter area(e.g Westlands)'
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            className='ml-2 px-3 py-1 outline-none border focus:bg[#dfdede] w-full focus:border-[1.5px] focus:border-orange-400 rounded-lg'
          />

          <button
            type='submit'
            className='bg-primary text-white rounded-lg px-4 py-2 cursor-pointer w-fit'>
              Appy Location
          </button>
      </form>
    </div>
  );
};

export default LocationSelector
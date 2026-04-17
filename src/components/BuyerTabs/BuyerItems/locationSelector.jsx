import React, { useState } from 'react';

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
          <select
            value={county}
            required
            onChange={(e) => setCounty(e.target.value)}
            className='border p-2 w-full ml-2 px-3 py-1 outline-none focus:bg[#dfdede] focus:border-[1.5px] focus:border-orange-400 rounded-lg'
            >
              <option value='' >Select County</option>
              {counties.map((c) => (
                <option  key={c} value={c}>
                  {c}
                </option>
              ))}
          </select> 

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
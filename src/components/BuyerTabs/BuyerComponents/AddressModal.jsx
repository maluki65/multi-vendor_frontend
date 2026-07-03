import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

function AddressModal({
  isOpen,
  onClose,
  profile,
  onSave,
  saving = false,
}) {
  const emptyAddress = {
    //label: '',
    country: '',
    city: '',
    street: '',
    postalCode: '',
  };

  const [selected, setSelected] = useState(0);
  const [addresses, setAddresses] = useState([emptyAddress]);

  useEffect(() => {
    if (!profile) return;

    if (profile.addresses?.length) {
      setAddresses(profile.addresses);
    } else {
      setAddresses([emptyAddress]);
    }

    setSelected(0);
  }, [profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddresses((prev) =>
      prev.map((addr, index) =>
        index === selected
          ? {
              ...addr,
              [name]: value,
            }
          : addr
      )
    );
  };

  const addAddress = () => {
    setAddresses((prev) => [...prev, emptyAddress]);
    setSelected(addresses.length);
  };

  const removeAddress = () => {
    if (addresses.length === 1) return;

    const next = addresses.filter((_, i) => i !== selected);

    setAddresses(next);
    setSelected(0);
  };

  const handleSave = async () => {
    try {
      await onSave({
        addresses,
      });
  
      onClose();
    } catch (error) {
      console.log('Failed to update addresses', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-9999'
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: .25 }}
            onClick={(e) => e.stopPropagation()}
            className='bg-white rounded-2xl w-full max-w-3xl p-6 m-2'
          >
            <div className='flex justify-between items-center mb-6'>
              <div>
                <h2 className='text-xl font-semibold'>
                  Shipping Addresses
                </h2>

                <p className='text-gray-500 text-sm'>
                  Add, edit or remove your delivery addresses.
                </p>
              </div>

              <button onClick={onClose}>
                <RiCloseCircleLine
                  size={30}
                  className='text-red-500 cursor-pointer'
                />
              </button>
            </div>

            <div className=''>{/*className='grid md:grid-cols-[280px_1fr] gap-5'*/}
              {/*}<div className='space-y-3 max-h-[450px] overflow-y-auto'>

                {addresses.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => setSelected(index)}
                    className={`border rounded-xl p-4 cursor-pointer transition
                    ${
                      selected === index
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className='flex justify-between'>

                      <div>

                        <div className='flex items-center gap-2'>
                          <IoLocationOutline
                            className='text-primary'
                          />

                          <h4 className='font-semibold'>
                            {address.label || `Address ${index + 1}`}
                          </h4>
                        </div>

                        <p className='text-sm text-gray-500 mt-2'>
                          {address.street || 'No street'}
                        </p>

                        <p className='text-sm text-gray-500'>
                          {address.city || '--'},{' '}
                          {address.country || '--'}
                        </p>

                      </div>

                      {selected === index && (
                        <FaCheckCircle
                          className='text-green-500'
                          size={22}
                        />
                      )}

                    </div>
                  </div>
                ))}

                <button
                  onClick={addAddress}
                  className='w-full border border-primary rounded-lg py-2 text-primary font-medium hover:bg-orange-50'
                >
                  + Add Address
                </button>
              </div>*/}

              <div className='grid grid-cols-2 space-y-4 gap-2 shippingModal'>
                {/*}<div>
                  <label className='text-sm font-medium'>
                    Label
                  </label>

                  <input
                    name='label'
                    value={addresses[selected]?.label || ''}
                    onChange={handleChange}
                    className='w-full mt-1 border rounded-lg p-2'
                    placeholder='Home'
                  />
                </div>*/}

                <div className=''>
                  <label className='text-sm font-medium'>
                    Country
                  </label>

                  <input
                    name='country'
                    value={addresses[selected]?.country || ''}
                    onChange={handleChange}
                    className='w-full mt-1 border rounded-lg p-2'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium'>
                    City / County
                  </label>

                  <input
                    name='city'
                    value={addresses[selected]?.city ||''}
                    onChange={handleChange}
                    className='w-full mt-1 border rounded-lg p-2'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium'>
                    Street
                  </label>

                  <input
                    name='street'
                    value={addresses[selected]?.street || ''}
                    onChange={handleChange}
                    className='w-full mt-1 border rounded-lg p-2'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium'>
                    Postal Code
                  </label>

                  <input
                    name='postalCode'
                    value={addresses[selected]?.postalCode || ''}
                    onChange={handleChange}
                    className='w-full mt-1 border rounded-lg p-2'
                  />
                </div>           
              </div>
            </div>

            <div className='flex gap-3 pt-3 items-center justify-end'>
              <button
                //onClick={removeAddress}
                onClick={onClose}
                className='px-5 py-2 rounded-lg border text-red-500 border-red-300 hover:bg-red-50 cursor-pointer'
              >
                cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSave}
                className='px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90 w-fit cursor-pointer'
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddressModal;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function VendorRevenueChart({ data }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(value / 100);
  };

  return(
    <div className='w-full h-[270px] RevChart'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <XAxis dataKey='month'/>
          <YAxis />
          <Tooltip
           formatter={(value) => formatCurrency(value)}
          />

          <Bar
            dataKey='income'
            fill='#84cc16'
            radius={[4, 4, 0, 0]}
            isAnimationActive={animate}
            animationDuration={900}
            animationEasing='ease-out'
          />

          <Bar
            dataKey='expenses'
            fill='#14532d'
            radius={[4, 4, 0, 0]}
            isAnimationActive={animate}
            animationDuration={900}
            animationBegin={200}
            animationEasing='ease-out'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VendorRevenueChart
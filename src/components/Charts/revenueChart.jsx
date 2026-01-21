import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../../commons';

function RevenueChart() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return(
    <div className='w-full h-[230px] RevChart'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={RevenueData}>
          <XAxis dataKey='month'/>
          <YAxis />
          <Tooltip />

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

export default RevenueChart
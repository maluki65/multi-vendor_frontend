import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesReportData } from '../../commons';

const toNumber = (value) => Number(value.replace(/,/g, ''));

function SalesReportChart() {
  const [animate, setAnimate] = useState(false);

  const colors = ['#84cc16', '#22c55e', '#fbbf24'];

  const totalCommission = SalesReportData.find(
    item => item.name === 'Total commission'
  );

  const commissionValue = totalCommission ? toNumber(totalCommission.value) : 0;

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className='w-full h-[250px] min-h-[250px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={SalesReportData.map(item => ({
              ...item,
              value: toNumber(item.value)
            }))}
            dataKey='value'
            nameKey='name'
            innerRadius={60}
            outerRadius={90}
            paddingAngle={1}
            isAnimationActive={animate}
            animationBegin={150}
            animationDuration={1000}
            animationEasing='ease-in-out'
          >
            {SalesReportData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <text
            x='50%'
            y='45%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-sm fill-gray-500 p-2'
          >
            Total Commission
          </text>
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-xl font-semibold fill-gray-800 p-2'
          >
            {commissionValue.toLocaleString()}
          </text>
          <Tooltip />  
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesReportChart
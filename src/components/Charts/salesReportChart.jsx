import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function SalesReportChart({ data }) {
  const [animate, setAnimate] = useState(false);

  const colors = ['#84cc16', '#22c55e', '#fbbf24'];

  useEffect(() => {
    setAnimate(true);
  }, []);

  const chartData = [
    {
      name: 'Orders',
      value: data?.totalOrders || 0,
    },
    /*{
      name: 'Revenue',
      value: data?.totalPlatformCommission || 0,
    },*/
    {
      name: 'Products sold',
      value: data?.totalProducts || 0,
    }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(value / 100);
  };

  return (
    <div className='w-full h-[250px] min-h-[250px] salesChart'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            innerRadius={70}
            outerRadius={100}
            paddingAngle={1}
            isAnimationActive={animate}
            animationBegin={150}
            animationDuration={1000}
            animationEasing='ease-in-out'
          >
            {chartData.map((_, index) => (
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
            className='text-sm fill-gray-500 p-2 texts'
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
            {formatCurrency(data?.totalPlatformCommission || 0)}
          </text>
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Orders' || name === 'Products sold'){
                return [value, name];
              }

              return [formatCurrency(value), name];
            }}
          />  
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesReportChart
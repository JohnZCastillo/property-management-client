import { useMemo } from "react";
import { Chart } from "react-charts";

export default function Bar() {
  const data = [
    {
      label: 'React Charts',
      data: [
        { date: new Date('2026-01-01'), stars: 10 },
        { date: new Date('2026-02-01'), stars: 20 },
        { date: new Date('2026-03-01'), stars: 30 },
        { date: new Date('2026-04-01'), stars: 40 },
        { date: new Date('2026-05-01'), stars: 50 },
        { date: new Date('2026-06-01'), stars: 60 },
      ],
    },
  ];

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.date,
      type: 'time',  // Better for dates
      formatters: {
        tooltip: (date) => date.toLocaleDateString(),
      },
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.stars,
        elementType: 'bar',
        // min: 0,  // Start from zero
        // max: 70, // Nice upper bound
      },
    ],
    []
  );

  return (
    <div className="h-[400px] border border-gray-300 p-5 rounded-lg"> 
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          defaultColors: ['#3b82f6', '#10b981'], // Custom colors
          getDatumText: (datum) => `${datum.originalDatum.stars} stars`,
        //   padding: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 }, // Gap control
        }}
      />
    </div>
  );
}

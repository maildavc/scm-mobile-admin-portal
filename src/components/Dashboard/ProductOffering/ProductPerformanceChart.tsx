import React from "react";

const ProductPerformanceChart = () => {
  const dataPoints = [
    500000, 650000, 820000, 800000, 790000, 700000, 550000, 420000, 250000,
    120000, 100000, 130000,
  ];
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yLabels = ["1M", "800k", "600k", "400k", "200k", "0"];

  const generatePath = (
    data: number[],
    width: number,
    height: number,
    max: number,
  ) => {
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (val / max) * height;
      return [x, y];
    });

    if (points.length === 0) return "";

    const smoothing = 0.2;
    let d = `M ${points[0][0]},${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2];

      const cp1 = p0
        ? [
            p1[0] + (p2[0] - p0[0]) * smoothing,
            p1[1] + (p2[1] - p0[1]) * smoothing,
          ]
        : [
            p1[0] + (p2[0] - p1[0]) * smoothing,
            p1[1] + (p2[1] - p1[1]) * smoothing,
          ];

      const cp2 = p3
        ? [
            p2[0] - (p3[0] - p1[0]) * smoothing,
            p2[1] - (p3[1] - p1[1]) * smoothing,
          ]
        : [
            p2[0] - (p2[0] - p1[0]) * smoothing,
            p2[1] - (p2[1] - p1[1]) * smoothing,
          ];

      d += ` C ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${p2[0]},${p2[1]}`;
    }

    return d;
  };

  const viewBoxWidth = 1000;
  const viewBoxHeight = 300;
  const linePath = generatePath(
    dataPoints,
    viewBoxWidth,
    viewBoxHeight,
    1000000,
  );
  const areaPath = `${linePath} L ${viewBoxWidth},${viewBoxHeight} L 0,${viewBoxHeight} Z`;

  return (
    <div className="pt-6 mb-8">
      <div className="mb-8">
        <p className="text-[13px] text-[#707781] font-medium mb-1">Portfolio size</p>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-1">NGN200M</h2>
        <p className="text-[13px] text-[#707781] font-medium">
          101M customers subscribed
        </p>
      </div>

      <div className="flex gap-4">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] text-[#9CA3AF] font-medium h-64">
          {yLabels.map((label, i) => (
            <span key={i} className="translate-y-[50%]">
              {label}
            </span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex flex-col">
          <div className="relative h-64 w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yLabels.map((_, i) => (
                <div
                  key={i}
                  className={`border-b ${
                    i === yLabels.length - 1
                      ? "border-gray-200"
                      : "border-gray-100 border-dashed"
                  }`}
                  style={{ height: "0px" }}
                ></div>
              ))}
            </div>

            {/* SVG Chart */}
            <div className="absolute inset-0 z-10">
              <svg
                viewBox={`0 -10 ${viewBoxWidth} ${viewBoxHeight + 10}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={areaPath}
                  fill="url(#chartGradient)"
                  className="transition-all duration-300"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between items-center text-[10px] text-[#9CA3AF] font-medium mt-2">
            {labels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPerformanceChart;

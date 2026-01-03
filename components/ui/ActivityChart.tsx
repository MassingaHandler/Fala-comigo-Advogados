import React from 'react';

interface DataPoint {
    month: string;
    count: number;
}

interface Props {
    data: DataPoint[];
    title?: string;
}

export default function ActivityChart({ data, title = "Atividade Mensal" }: Props) {
    const maxValue = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">{title}</h3>

            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((point, index) => {
                    const height = (point.count / maxValue) * 100;
                    const isHighest = point.count === maxValue && maxValue > 0;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex items-end justify-center h-40">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${isHighest
                                            ? 'bg-gradient-to-t from-red-500 to-red-600'
                                            : 'bg-gradient-to-t from-blue-400 to-blue-500'
                                        } hover:opacity-80 cursor-pointer`}
                                    style={{
                                        height: `${height}%`,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {point.count} consultas
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{point.month}</span>
                        </div>
                    );
                })}
            </div>

            {data.every(d => d.count === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    Nenhuma atividade registrada ainda
                </div>
            )}
        </div>
    );
}

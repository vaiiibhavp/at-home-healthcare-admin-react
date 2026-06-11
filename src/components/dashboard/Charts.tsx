import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';
import { useGetRequestsOverTimeQuery, useGetRequestsByStatusQuery } from '../../services/dashboardApi';

const Charts: React.FC = () => {
  const { t } = useTranslation();
  const [days, setDays] = useState(7);
  const requestsOverTimeQuery = useGetRequestsOverTimeQuery({ days });
  const { data: requestsData, isLoading: isLoadingTimeData, error: timeDataError } = requestsOverTimeQuery;
  const { data: statusData, isLoading: isLoadingStatusData, error: statusDataError } = useGetRequestsByStatusQuery();
  
  const lineData = requestsData ? [
    {
      x: requestsData.data.map(item => item.date),
      y: requestsData.data.map(item => item.count),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: t('dashboard.charts.requests'),
      line: {
        color: '#526674',
        width: 3,
        //shape: 'spline' as const
        shape: 'linear' as const
      },
      fill: 'tozeroy' as const,
      fillcolor: 'rgba(82, 102, 116, 0.05)'
    }
  ] : [];

  const translateStatusLabel = (label: string): string => {
    const labelMap: Record<string, string> = {
      'Completed': 'requests.completed',
      'In Progress': 'requests.inProgress',
      'Pending': 'requests.pending',
      'Returned': 'requests.returned',
      'Draft': 'requests.draft',
      'Cancelled': 'requests.cancelled',
      'Approved': 'requests.approved',
      'Rejected': 'requests.rejected',
      'Submitted': 'requests.submitted',
    };
    const key = labelMap[label];
    return key ? t(key) : label;
  };

  const pieData = statusData ? [
    {
      values: statusData.data.breakdown.map(item => item.count),
      labels: statusData.data.breakdown.map(item => translateStatusLabel(item.label)),
      type: 'pie' as const,
      hole: 0.7,
      marker: {
        colors: statusData.data.breakdown.map(item => item.color)
      },
      textinfo: 'none' as const
    }
  ] : [];

  const maxRequestCount = requestsData?.data.reduce((max, item) => Math.max(max, item.count), 0) ?? 0;
  const yTickStep = Math.max(1, Math.ceil(maxRequestCount / 5));
  const yRangeMax = Math.max(maxRequestCount + yTickStep, 5);

  const lineLayout = {
    margin: {
      t: 10,
      r: 10,
      b: 40,
      l: 40
    },
    xaxis: {
      gridcolor: '#F1F5F9',
      zeroline: false,
      fixedrange: true,
      automargin: true
    },
    yaxis: {
      gridcolor: '#F1F5F9',
      zeroline: false,
      fixedrange: true,
      tickmode: 'linear' as const,
      tick0: 0,
      dtick: yTickStep,
      range: [0, yRangeMax]
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    hovermode: 'closest' as const,
    dragmode: false as const,
    autosize: true,
    height: 300
  };

  const pieLayout = {
    margin: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    showlegend: false,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    autosize: true,
    height: 240
  };

  const config = {
    displayModeBar: false,
    scrollZoom: false,
    doubleClick: false as false,
    showTips: false
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDays = Number(e.target.value);
    setDays(newDays);
    requestsOverTimeQuery.refetch();
  };

  const isLoading = isLoadingTimeData || isLoadingStatusData;
  const hasError = timeDataError || statusDataError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-500 text-lg font-bold">{t('dashboard.loadingChartData')}</p>
      </div>
    );
  }

  if (hasError) {
    const error = timeDataError || statusDataError;
    const errorMessage = error && typeof error === 'object' && error !== null && 'status' in error ?
      (error as { data?: { message?: string } }).data?.message || t('dashboard.errorLoadingCharts') :
      (error as { message?: string })?.message || t('common.error');

    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-error text-lg font-bold">{t('common.error')}: {errorMessage}</p>
      </div>
    );
  }

  return (
    <section id="charts-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Requests Over Time */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-slate-800">{t('dashboard.charts.requestsOverTime')}</h4>
          <select 
            value={days}
            onChange={handleDaysChange}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none"
          >
            <option value={7}>{t('dashboard.charts.last7Days')}</option>
            <option value={30}>{t('dashboard.charts.last30Days')}</option>
          </select>
        </div>
        <div id="requests-line-chart">
          <Plot
            data={lineData}
            layout={lineLayout}
            config={config}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Requests by Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow">
        <h4 className="font-bold text-slate-800 mb-6">{t('dashboard.charts.requestsByStatus')}</h4>
        <div id="status-donut-chart">
          <Plot
            data={pieData}
            layout={pieLayout}
            config={config}
            style={{ width: '100%' }}
          />
        </div>
        <div className="mt-4 space-y-2">
          {statusData?.data.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2">
                <i
                  className="fa-solid fa-circle text-[8px]"
                  style={{ color: item.color }}
                ></i>
                {translateStatusLabel(item.label)}
              </span>
              <span className="font-bold">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Charts;

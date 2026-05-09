const CSV_URL = "https://docs.google.com/spreadsheets/d/1k9qkdtphT5a2WudjcemijxHsO-HRFr7QyNs0XKeDIxA/export?format=csv";

let fullData = [];
let drilldownChartInstance = null;
let comparisonChartInstance = null;
let currentMetric = 'totalCost';

const METRICS = {
    totalCost: { label: 'Total Energy Cost', unit: '£', format: 'currency', lowerIsBetter: true },
    gridCost: { label: 'Grid Elec Cost', unit: '£', format: 'currency', lowerIsBetter: true },
    gasCost: { label: 'Gas Cost', unit: '£', format: 'currency', lowerIsBetter: true },
    evCost: { label: 'EV Total Cost', unit: '£', format: 'currency', lowerIsBetter: true },

    exportIncome: { label: 'Export Income', unit: '£', format: 'currency', lowerIsBetter: false },
    batterySavings: { label: 'Battery Savings', unit: '£', format: 'currency', lowerIsBetter: false },
    solarValue: { label: 'Solar Value', unit: '£', format: 'currency', lowerIsBetter: false },

    electricity: { label: 'Grid Import', unit: 'kWh', format: 'number', lowerIsBetter: true },
    solar: { label: 'Solar Gen', unit: 'kWh', format: 'number', lowerIsBetter: false },
    gas: { label: 'Gas Used', unit: 'kWh', format: 'number', lowerIsBetter: true },
    evCharge: { label: 'EV Charge Vol', unit: 'kWh', format: 'number', lowerIsBetter: true },

    gridDependency: { label: 'Grid Dependency', unit: '%', format: 'percentage', lowerIsBetter: true, isAvg: true },
    selfConsumption: { label: 'Solar Self-Consumption', unit: '%', format: 'percentage', lowerIsBetter: false, isAvg: true },
    offPeakPct: { label: 'Off-Peak Ratio', unit: '%', format: 'percentage', lowerIsBetter: false, isAvg: true },

    teslaDistance: { label: 'Distance Driven', unit: 'km', format: 'number', lowerIsBetter: false },
    teslaEfficiency: { label: 'Avg Efficiency', unit: 'Wh/km', format: 'number', lowerIsBetter: true, isAvg: true },
    teslaSoC: { label: 'Avg Battery SoC', unit: '%', format: 'percentage', lowerIsBetter: false, isAvg: true }
};

function parseCurrency(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.-]+/g, ""));
}

function parseFloatSafe(str) {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
}

function parsePercentage(str) {
    if (!str) return 0;
    let val = parseFloat(str.replace('%', ''));
    return isNaN(val) ? 0 : val;
}

function formatValue(val, key) {
    const meta = METRICS[key];
    if (meta.format === 'currency') {
        return '£' + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
    } else if (meta.format === 'percentage') {
        return val.toFixed(1) + '%';
    }
    // Handle very small numbers by keeping decimals if necessary
    if (val > 0 && val < 10) {
        return val.toFixed(1) + ' ' + meta.unit;
    }
    return Math.round(val).toLocaleString() + ' ' + meta.unit;
}

document.addEventListener('DOMContentLoaded', () => {
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Setup Compare Metric Options
    const compareSelect = document.getElementById('compareMetric');
    compareSelect.innerHTML = '';
    Object.keys(METRICS).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = METRICS[key].label;
        compareSelect.appendChild(opt);
    });

    document.getElementById('timePeriod').addEventListener('change', updateDashboard);
    document.getElementById('chartType').addEventListener('change', () => updateCharts(getFilteredData()));
    document.getElementById('compareMetric').addEventListener('change', () => updateCharts(getFilteredData()));

    document.querySelectorAll('.kpi-card.clickable').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentMetric = target.getAttribute('data-metric');
            document.getElementById('mainChartTitle').textContent = METRICS[currentMetric].label + ' Details';
            updateCharts(getFilteredData());
        });
    });

    fetchData();
});

function fetchData() {
    document.getElementById('loadingIndicator').style.display = 'flex';

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            fullData = results.data
                .filter(row => row.Date && row.Date.trim() !== '' && !row.Date.includes('Source:'))
                .map(row => {
                    return {
                        date: new Date(row.Date),
                        rawDateStr: row.Date,
                        totalCost: parseCurrency(row.Total_Cost_GBP),
                        gridCost: parseCurrency(row.Electricity_Cost_GBP),
                        gasCost: parseCurrency(row.Gas_Cost_GBP),
                        evCost: parseCurrency(row.EV_Cost_Total_GBP),
                        exportIncome: parseCurrency(row.Export_Income_GBP),
                        batterySavings: parseCurrency(row.Battery_Savings_GBP),
                        solarValue: parseCurrency(row.Solar_Daily_Value_GBP),
                        electricity: parseFloatSafe(row.Electricity_kWh),
                        solar: parseFloatSafe(row.Solar_kWh),
                        gas: parseFloatSafe(row.Gas_kWh),
                        evCharge: parseFloatSafe(row.EV_Charge_kWh),
                        gridDependency: parsePercentage(row.Grid_Dependency_Pct),
                        selfConsumption: parsePercentage(row.Self_Consumption_Pct),
                        offPeakPct: parsePercentage(row.OffPeak_Pct),
                        teslaDistance: parseFloatSafe(row.Tesla_Drives_Distance_km),
                        teslaEfficiency: parseFloatSafe(row.Tesla_Drives_Efficiency_Wh_km),
                        teslaSoC: parsePercentage(row.Tesla_Battery_SoC_Avg_Pct)
                    };
                })
                .filter(row => !isNaN(row.date.getTime()))
                .sort((a, b) => a.date - b.date);

            document.getElementById('loadingIndicator').style.display = 'none';
            updateDashboard();
        },
        error: function(error) {
            console.error('Error fetching CSV:', error);
            document.getElementById('loadingIndicator').innerHTML = 'Error loading data.';
        }
    });
}

function getFilteredData() {
    if (fullData.length === 0) return { current: [], previous: [], periodSelect: '30' };

    const periodSelect = document.getElementById('timePeriod').value;
    const latestDate = fullData[fullData.length - 1].date;

    if (periodSelect === 'all') {
        return { current: fullData, previous: [], periodSelect };
    }

    const days = parseInt(periodSelect);
    const currentStartDate = new Date(latestDate);
    currentStartDate.setDate(currentStartDate.getDate() - days);

    const previousStartDate = new Date(currentStartDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const currentData = fullData.filter(d => d.date > currentStartDate && d.date <= latestDate);
    const previousData = fullData.filter(d => d.date > previousStartDate && d.date <= currentStartDate);

    return { current: currentData, previous: previousData, periodSelect };
}

function updateDashboard() {
    const data = getFilteredData();
    if (data.current.length === 0) return;

    updateKPIs(data.current, data.previous, data.periodSelect);
    updateCharts(data);
    updateTable(data.current);
}

function updateKPIs(current, previous, periodSelect) {
    Object.keys(METRICS).forEach(key => {
        const meta = METRICS[key];
        let curVal, prevVal;

        // Filter out records where the value might be exactly 0 if it's an average to avoid skewing,
        // but for safety, we just average over all available days in the period.
        if (meta.isAvg) {
            const sumCur = current.reduce((acc, curr) => acc + curr[key], 0);
            curVal = current.length > 0 ? sumCur / current.length : 0;
            const sumPrev = previous.reduce((acc, curr) => acc + curr[key], 0);
            prevVal = previous.length > 0 ? sumPrev / previous.length : 0;
        } else {
            curVal = current.reduce((acc, curr) => acc + curr[key], 0);
            prevVal = previous.reduce((acc, curr) => acc + curr[key], 0);
        }

        const el = document.getElementById(`kpi-${key}`);
        if (el) el.textContent = formatValue(curVal, key);

        setTrend(`trend-${key}`, curVal, prevVal, periodSelect, meta.lowerIsBetter);
    });
}

function setTrend(elementId, current, previous, periodSelect, lowerIsBetter) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (periodSelect === 'all' || previous === 0) {
        el.innerHTML = '-';
        el.className = 'kpi-trend trend-neutral';
        return;
    }

    const diff = current - previous;
    const pct = (diff / previous) * 100;

    const isUp = diff > 0;
    const isGood = isUp ? !lowerIsBetter : lowerIsBetter;

    const arrow = isUp ? '↑' : '↓';
    const colorClass = isGood ? 'good' : 'bad';
    const dirClass = isUp ? 'trend-up' : 'trend-down';

    el.innerHTML = `${arrow} ${Math.abs(pct).toFixed(1)}%`;
    el.className = `kpi-trend ${dirClass} ${colorClass}`;
}

function updateCharts(dataObj) {
    const { current, previous } = dataObj;
    if (!current || current.length === 0) return;

    // Drilldown Chart
    const cType = document.getElementById('chartType').value;
    const ctxDrill = document.getElementById('drilldownChart').getContext('2d');
    if (drilldownChartInstance) drilldownChartInstance.destroy();

    let gradient = ctxDrill.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    drilldownChartInstance = new Chart(ctxDrill, {
        type: cType,
        data: {
            labels: current.map(d => d.date),
            datasets: [{
                label: METRICS[currentMetric].label,
                data: current.map(d => d[currentMetric]),
                backgroundColor: cType === 'bar' ? 'rgba(59, 130, 246, 0.7)' : gradient,
                borderColor: '#3b82f6',
                borderWidth: 2,
                fill: cType === 'line',
                tension: 0.3,
                pointRadius: current.length > 60 ? 0 : 3,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: { unit: current.length > 90 ? 'month' : 'day' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    title: { display: true, text: METRICS[currentMetric].unit, color: 'rgba(255,255,255,0.5)' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatValue(context.parsed.y, currentMetric);
                        }
                    }
                }
            }
        }
    });

    // Comparison Chart Overlay
    const compMetric = document.getElementById('compareMetric').value;
    const ctxComp = document.getElementById('comparisonChart').getContext('2d');
    if (comparisonChartInstance) comparisonChartInstance.destroy();

    const maxLen = Math.max(current.length, previous.length);
    const labels = Array.from({length: maxLen}, (_, i) => `Day ${i+1}`);

    comparisonChartInstance = new Chart(ctxComp, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Period',
                    data: current.map(d => d[compMetric]),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: maxLen > 60 ? 0 : 2,
                    pointHoverRadius: 6,
                    fill: true
                },
                {
                    label: 'Previous Period',
                    data: previous.map(d => d[compMetric]),
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.02)' }
                },
                y: {
                    title: { display: true, text: METRICS[compMetric].unit, color: 'rgba(255,255,255,0.5)' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { position: 'top', labels: { color: 'rgba(255,255,255,0.7)' } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatValue(context.parsed.y, compMetric);
                        }
                    }
                }
            }
        }
    });
}

function updateTable(currentData) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    const rows = [...currentData].reverse();

    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 0.5rem; white-space: nowrap;">${row.rawDateStr}</td>
            <td style="padding: 0.5rem; text-align: right; color: ${row.totalCost > 0 ? '#f87171' : '#4ade80'}">${formatValue(row.totalCost, 'totalCost')}</td>
            <td style="padding: 0.5rem; text-align: right;">${formatValue(row.gridCost, 'gridCost')}</td>
            <td style="padding: 0.5rem; text-align: right; color: #4ade80">+${formatValue(row.exportIncome, 'exportIncome')}</td>
            <td style="padding: 0.5rem; text-align: right; color: #4ade80">+${formatValue(row.batterySavings, 'batterySavings')}</td>
            <td style="padding: 0.5rem; text-align: right;">${formatValue(row.gridDependency, 'gridDependency')}</td>
            <td style="padding: 0.5rem; text-align: right; color: #4ade80">${formatValue(row.selfConsumption, 'selfConsumption')}</td>
        `;
        tbody.appendChild(tr);
    });
}

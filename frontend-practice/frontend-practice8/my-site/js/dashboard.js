(function () {
  const DATA_URLS = { actual: 'data/prep.json', plan: 'data/plan.json' };
  const PALETTE = ['#164a8a', '#f97316', '#6c9bd1'];
  const HINT_DEFAULT = '提示：点柱状图里的柱子，折线图会只显示那一类（再点一次恢复）。';

  const state = { actual: null, plan: null, focus: null };

  let barChart = null;
  let lineChart = null;
  let pieChart = null;

  const setStatus = (text, type) => {
    $('#prep-status').removeClass('alert-warning alert-success alert-danger').addClass(type).text(text).show();
  };

  const loadJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return response.json();
  };

  const renderCards = (data) => {
    $('#cards').empty();
    data.series.forEach(s => {
      const total = s.counts.reduce((sum, n) => sum + n, 0);
      const avg = (total / data.weeks.length).toFixed(1);
      $('#cards').append(`
        <div class="col-12 col-md-4">
          <div class="card entry-card h-100">
            <div class="card-body">
              <h3 class="card-title h6">${s.category}</h3>
              <p class="card-text fs-4 mb-1">${total} <span class="fs-6 text-muted">${data.unit}</span></p>
              <p class="card-text small text-muted mb-0">共 ${data.weeks.length} 周，平均每周 ${avg} ${data.unit}</p>
            </div>
          </div>
        </div>
      `);
    });
  };

  const renderBarChart = (data) => {
    if (barChart === null) {
      barChart = echarts.init(document.querySelector('#bar-chart'));
      barChart.on('click', params => toggleFocus(params.seriesName));
    }
    barChart.setOption({
      color: PALETTE,
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      xAxis: { data: data.weeks },
      yAxis: { name: data.unit },
      series: data.series.map(s => ({ name: s.category, type: 'bar', data: s.counts }))
    });
  };

  const renderLineChart = (data) => {
    if (lineChart !== null) {
      lineChart.destroy();
    }
    lineChart = new Chart(document.querySelector('#line-chart'), {
      type: 'line',
      data: {
        labels: data.weeks,
        datasets: data.series.map((s, i) => ({
          label: s.category,
          data: s.counts,
          borderColor: PALETTE[i],
          backgroundColor: PALETTE[i],
          borderWidth: 2,
          tension: 0.3
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: data.unit } }
        }
      }
    });
  };

  const renderPieChart = (data) => {
    if (pieChart === null) {
      pieChart = echarts.init(document.querySelector('#pie-chart'));
    }
    const rows = data.series.map(s => ({
      name: s.category,
      value: s.counts.reduce((sum, n) => sum + n, 0)
    }));
    pieChart.setOption({
      color: PALETTE,
      tooltip: { trigger: 'item', formatter: p => p.name + '：' + p.value + ' ' + data.unit + '（' + p.percent.toFixed(1) + '%）' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: '55%',
        center: ['50%', '45%'],
        data: rows,
        label: { formatter: p => p.name + '\n' + p.percent.toFixed(1) + '%', fontSize: 11, lineHeight: 14, overflow: 'break', width: 76 },
        labelLine: { length: 8, length2: 8 }
      }]
    });
  };

  const toggleFocus = (name) => {
    state.focus = state.focus === name ? null : name;
    lineChart.data.datasets.forEach(d => {
      d.hidden = state.focus !== null && d.label !== state.focus;
    });
    lineChart.update();
    $('#focus-hint').text(
      state.focus === null
        ? HINT_DEFAULT
        : '已联动：折线图只显示「' + state.focus + '」（再点一次恢复）。'
    );
  };

  const renderAll = (data) => {
    state.focus = null;
    $('#focus-hint').text(HINT_DEFAULT);
    $('#prep-sub').text(data.title + ' · 数据来源：' + data.source);
    renderCards(data);
    renderBarChart(data);
    renderLineChart(data);
    renderPieChart(data);
  };

  const loadData = async () => {
    setStatus('加载中...', 'alert-warning');
    try {
      const start = performance.now();
      const [actual, plan] = await Promise.all([loadJson(DATA_URLS.actual), loadJson(DATA_URLS.plan)]);
      const ms = performance.now() - start;
      if (actual.series.length === 0) {
        setStatus('暂无数据', 'alert-warning');
        return;
      }
      state.actual = actual;
      state.plan = plan;
      renderAll(actual);
      setStatus('数据加载完成：两份 JSON 并行加载用时 ' + ms.toFixed(0) + ' ms', 'alert-success');
    } catch (error) {
      setStatus('加载失败：' + error.message, 'alert-danger');
    }
  };

  $('#source-switch').on('click', 'button', function () {
    const usePlan = $(this).data('source') === 'plan';
    const data = usePlan ? state.plan : state.actual;
    if (data === null) {
      return;
    }
    $('#source-switch button').removeClass('btn-accent').addClass('btn-outline-secondary');
    $(this).removeClass('btn-outline-secondary').addClass('btn-accent');
    renderAll(data);
  });

  window.addEventListener('resize', () => {
    if (barChart) barChart.resize();
    if (pieChart) pieChart.resize();
  });

  loadData();
})();

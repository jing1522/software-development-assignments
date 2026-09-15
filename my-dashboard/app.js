const state = { data: null, plan: null, focus: null };

const DATA_URLS = ['data/prep.json', 'data/plan.json'];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadJson = async (url, delay) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  const data = await response.json();
  await sleep(delay);
  return data;
};

const loadSerial = async (urls, delay) => {
  const start = performance.now();
  const out = [];
  for (const url of urls) {
    out.push(await loadJson(url, delay));
  }
  return { out, ms: performance.now() - start };
};

const loadParallel = async (urls, delay) => {
  const start = performance.now();
  const out = await Promise.all(urls.map(url => loadJson(url, delay)));
  return { out, ms: performance.now() - start };
};

const setStatus = (text, type) => {
  $('#status').removeClass('alert-warning alert-success alert-danger').addClass(type).text(text).show();
};

const loadData = async () => {
  setStatus('加载中...', 'alert-warning');
  try {
    const result = await loadParallel(DATA_URLS, 0);
    const prep = result.out[0];
    if (prep.series.length === 0) {
      setStatus('暂无数据', 'alert-warning');
      return false;
    }
    state.data = prep;
    state.plan = result.out[1];
    $('#sub-title').text(prep.title + ' · 数据来源：' + prep.source);
    renderAll(prep);
    setStatus('全部完成：两份数据并行加载用时 ' + result.ms.toFixed(0) + ' ms', 'alert-success');
    return true;
  } catch (error) {
    setStatus('加载失败：' + error.message, 'alert-danger');
    return false;
  }
};

const renderCards = (data) => {
  $('#cards').empty();
  data.series.forEach(s => {
    const total = s.counts.reduce((sum, n) => sum + n, 0);
    const avg = (total / data.weeks.length).toFixed(1);
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${s.category}</h3>
            <p class="card-text fs-4 mb-1">${total} <span class="fs-6 text-muted">${data.unit}</span></p>
            <p class="card-text small text-muted">共 ${data.weeks.length} 周，平均每周 ${avg} ${data.unit}</p>
          </div>
        </div>
      </div>
    `);
  });
};

let barChart = null;

const renderBarChart = (data) => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
    barChart.on('click', params => toggleFocus(params.seriesName));
  }
  barChart.setOption({
    title: { text: '各周各类备赛时长（单位：小时）', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { data: data.weeks },
    yAxis: { name: data.unit },
    series: data.series.map(s => ({
      name: s.category,
      type: 'bar',
      data: s.counts
    }))
  });
};

let lineChart = null;

const renderLineChart = (data) => {
  if (lineChart !== null) {
    lineChart.destroy();
  }
  const ctx = document.querySelector('#line-chart');
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.weeks,
      datasets: data.series.map(s => ({
        label: s.category,
        data: s.counts,
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '备赛时长变化趋势（单位：小时）' }
      }
    }
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
      ? '联动提示：点击柱状图里的柱子，折线图只显示那一类（再点一次恢复全部）。'
      : '已联动：折线图只显示「' + state.focus + '」（再点一次恢复全部）。'
  );
};

const renderAll = (data) => {
  state.focus = null;
  $('#focus-hint').text('联动提示：点击柱状图里的柱子，折线图只显示那一类（再点一次恢复全部）。');
  renderCards(data);
  renderBarChart(data);
  renderLineChart(data);
};

const drawMisleading = (id, counts, labels, min, color) => {
  new Chart(document.querySelector(id), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: '文学类借阅量（册）', data: counts, backgroundColor: color }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '文学类每月借阅量（单位：册）' },
        legend: { display: false }
      },
      scales: { y: { min: min } }
    }
  });
};

const loadBooks = async () => {
  try {
    const books = await loadJson('data/books.json', 0);
    if (books.series.length === 0) {
      return;
    }
    const counts = books.series[0].counts;
    drawMisleading('#bad-chart', counts, books.months, 300, '#dc3545');
    drawMisleading('#good-chart', counts, books.months, 0, '#198754');
  } catch (error) {
    $('#books-status').text('课堂统一数据加载失败：' + error.message);
  }
};

$('#source-switch').on('click', 'button', function () {
  const usePlan = $(this).data('source') === 'plan';
  $('#source-switch button').removeClass('btn-primary').addClass('btn-outline-primary');
  $(this).removeClass('btn-outline-primary').addClass('btn-primary');
  const data = usePlan ? state.plan : state.data;
  $('#sub-title').text(data.title + ' · 数据来源：' + data.source);
  renderAll(data);
});

const runTimingTest = async () => {
  const delay = Number($('#delay-input').val()) || 0;
  $('#timing').text('测试中...');
  try {
    const parallel = await loadParallel(DATA_URLS, delay);
    const serial = await loadSerial(DATA_URLS, delay);
    $('#timing').html(
      '并行：<b>' + parallel.ms.toFixed(0) + ' ms</b> ｜ 串行：<b>' + serial.ms.toFixed(0) + ' ms</b>' +
      ' ｜ 并行是串行的 <b>' + (parallel.ms / serial.ms * 100).toFixed(0) + '%</b>'
    );
  } catch (error) {
    $('#timing').text('测试失败：' + error.message);
  }
};

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
});

$('#test-timing').on('click', runTimingTest);

loadData().then(ok => {
  if (ok) runTimingTest();
});

loadBooks();

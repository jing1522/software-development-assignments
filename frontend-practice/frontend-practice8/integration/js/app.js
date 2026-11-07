
const rooms = [
  { name: '一楼自习室 A', floor: 1, open: 'open' },
  { name: '一楼自习室 B', floor: 1, open: 'closed' },
  { name: '二楼自习室 C', floor: 2, open: 'open' },
  { name: '二楼自习室 D', floor: 2, open: 'open' },
  { name: '三楼自习室 E', floor: 3, open: 'closed' },
  { name: '三楼自习室 F', floor: 3, open: 'open' }
];

const floorFilter = document.getElementById('floor-filter');
const openFilter = document.getElementById('open-filter');
const roomList = document.getElementById('room-list');
const roomCount = document.getElementById('room-count');

const renderRooms = () => {
  
  const shown = rooms.filter(r => {
    const floorOk = floorFilter.value === '' || r.floor === Number(floorFilter.value);
    const openOk = openFilter.value === '' || r.open === openFilter.value;
    return floorOk && openOk;
  });

  
  roomList.innerHTML = '';
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = '没有符合条件的自习室';
    roomList.appendChild(li);
  }
  shown.forEach(r => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = r.name + ' · ' + r.floor + ' 层 · ' + (r.open === 'open' ? '开放中' : '已关闭');
    roomList.appendChild(li);
  });

  roomCount.textContent = '共 ' + shown.length + ' 间';
};

floorFilter.addEventListener('change', renderRooms);
openFilter.addEventListener('change', renderRooms);

renderRooms();

const chart = echarts.init(document.getElementById('usage-chart'));

$.getJSON('data/data.json')
    .done(data => {
    if (!data.rooms || data.rooms.length === 0) {
      document.getElementById('chart-status').textContent = '暂无数据：data.json 里还没有记录';
      return;
    }
    chart.setOption({
      title: { text: data.title, subtext: data.source },
      tooltip: { trigger: 'axis', valueFormatter: v => v + ' ' + data.unit },
      xAxis: { type: 'category', data: data.rooms.map(r => r.name) },
      yAxis: { type: 'value', name: '使用量（' + data.unit + '）' },
      series: [{ type: 'bar', data: data.rooms.map(r => r.count), barMaxWidth: 48 }]
    });
  })
  .fail(() => {
    document.getElementById('chart-status').textContent = '数据加载失败：请检查 data/data.json 是否存在、格式是否正确';
  });

window.addEventListener('resize', () => chart.resize());  
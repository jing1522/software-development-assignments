const expenses = [
  { category: '餐饮', amount: 230.90 },
  { category: '购物', amount: 60.60 },
  { category: '医疗', amount: 14.18 },
  { category: '交通', amount: 4.00 },
  { category: '其他', amount: 41.10 },
  { category: '退款', amount: -30.00 },      // 负金额
  { category: '零食', amount: '25.5元' }      // 非数字金额
];
console.table(expenses);

// 把脏金额统一转成数字：数字直接返回；字符串先去空格，再从开头抓一段数字（含小数点），抓不到返回 NaN
const toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return NaN;
  const matched = value.trim().match(/^\d*\.?\d+/);
  return matched ? Number(matched[0]) : NaN;
};

// 清洗数据：把每条金额转成数字，只剔除转换失败（NaN）的记录，负数退款等有效数字保留
const cleanExpenses = (list) =>
  list
    .map(e => ({ category: e.category, amount: toNumber(e.amount) }))
    .filter(e => Number.isFinite(e.amount));

// 计算总金额
const totalAmount = (list) => list.reduce((sum, e) => sum + e.amount, 0);

// 计算平均支出（空数组返回0）
const average =(list)=>{
    if(list.length===0)return 0;
    return Number((totalAmount(list)/list.length).toFixed(2));
};

// 找出金额最高的一笔消费
const topCategory = (list) => {
  if (list.length === 0) return null;     
  return list.reduce((max, item) => (item.amount > max.amount ? item : max), list[0]);
};

// 为每条记录追加占总支出的百分比
const withPercent = (list) => {
  const total = totalAmount(list);
  if (total === 0) return [];
  return list.map((item) => ({
    category: item.category,
    amount: item.amount,
    percent: Number(((item.amount / total) * 100).toFixed(1))
  }));
};

// 按两个字段先后排序：先按类别（中文拼音）升序，，类别相同时再按金额降序
const sort = (list) =>
  [...list].sort((a, b) => {
    const byCategory = a.category.localeCompare(b.category, 'zh');
    if (byCategory !== 0) return byCategory;  // 类别不同：按类别排
    return b.amount - a.amount;               // 类别相同：按金额从高到低排
  });

console.log('清洗后：', cleanExpenses(expenses));
console.log('平均支出：', average(cleanExpenses(expenses)));
console.log('最高单笔：', topCategory(cleanExpenses(expenses)));
console.log('按类别+金额排序：');
console.table(sort(cleanExpenses(expenses)));

// 格式化报告
const report = (list) => {
  const valid = cleanExpenses(list);
  if (valid.length === 0) {
    return '没有有效消费记录';
  }
  const topItem = topCategory(valid);
  // 占比只统计实际支出
  const dist = withPercent(valid.filter(e => e.amount > 0))
    .map(item => `${item.category}${item.percent}%`)
    .join('、');
  return `有效消费${valid.length}笔，总支出¥${totalAmount(valid).toFixed(2)}，平均¥${average(valid)}，最高单笔${topItem.category}¥${topItem.amount.toFixed(2)}；
各类占比：${dist}；
数据来源：近10天消费记录`;
};

try {
  console.log(report(expenses));
} catch (err) {
  console.error('报告生成失败：', err.message);
}





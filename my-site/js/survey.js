(function () {
  const STORAGE_KEY = 'survey_records';

  const readRecords = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? [] : JSON.parse(raw);
    } catch (error) {
      return [];
    }
  };

  const setStatus = (text, type) => {
    $('#survey-status').removeClass('alert-success alert-danger').addClass(type).text(text).show();
  };

  const updateCount = () => {
    $('#survey-count').text('这台电脑上已保存 ' + readRecords().length + ' 份记录');
  };

  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  $('#survey-form').on('submit', function (event) {
    event.preventDefault();

    const name = $('#s-name').val().trim();
    const mail = $('#s-mail').val().trim();
    const grade = $('#s-grade').val();

    if (name === '') {
      setStatus('名字不能为空，先填一下称呼吧。', 'alert-danger');
      return;
    }
    if (!emailOk(mail)) {
      setStatus('邮箱格式好像不对，检查一下。', 'alert-danger');
      return;
    }
    if (grade === '') {
      setStatus('还没选年级，选好再提交。', 'alert-danger');
      return;
    }

    const stages = [];
    $('#survey-form input[name="stage"]:checked').each(function () {
      stages.push($(this).val());
    });

    const records = readRecords();
    records.push({
      name: name,
      mail: mail,
      grade: grade,
      experience: $('#survey-form input[name="experience"]:checked').val() || '',
      stages: stages,
      ai: $('#s-ai').val(),
      payment: $('#survey-form input[name="payment"]:checked').val() || '',
      advice: $('#s-advice').val().trim(),
      time: new Date().toLocaleString()
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      setStatus('保存失败：本地存储不可用，可以清一点空间再试。', 'alert-danger');
      return;
    }

    this.reset();
    updateCount();
    setStatus('已保存，谢谢你的填写！', 'alert-success');
  });

  updateCount();
})();

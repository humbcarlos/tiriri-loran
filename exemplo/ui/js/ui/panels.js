function renderNews() {
  const container = document.getElementById('newsList');
  if (!container) return;
  
  let html = '';
  Config.news.updates.forEach(news => {
    html += `
      <div class="news-item">
        <div class="news-item-title">${news.title}</div>
        <div class="news-item-date">${news.date}</div>
        <div class="news-item-content">${news.content}</div>
      </div>
    `;
  });
  newsList.innerHTML = html;
}

function renderStaff() {
  let html = '';
  Config.staff.members.forEach(member => {
    const iconMap = { crown: 'fa-crown', shield: 'fa-shield-alt', star: 'fa-star', user: 'fa-user' };
    const icon = iconMap[member.icon] || 'fa-user';
    html += `
      <div class="staff-item">
        <i class="fas ${icon}" style="color:${member.color}"></i>
        ${member.role}: ${member.name}
      </div>
    `;
  });
  staffList.innerHTML = html;
}

function renderRules() {
  const container = document.getElementById('rulesList');
  if (!container) return;
  
  let html = '';
  Config.rules.list.forEach(rule => {
    html += `<div class="rule-item">${rule}</div>`;
  });
  container.innerHTML = html;
}

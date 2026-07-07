let serverBlips = [];

function convertToMapPercent(x, y) {
    const bounds = Config.map.mapBounds;
    const radius = bounds.radius;
    const width = bounds.width;
    const height = bounds.height;
    const xOffset = bounds.xOffset;
    const yOffset = bounds.yOffset;
    
    let left = (x + radius - xOffset) / width * 100;
    let bottom = (y + radius - yOffset) / height * 100;
    
    left = Math.max(0, Math.min(100, left));
    bottom = Math.max(0, Math.min(100, bottom));
    
    return { left, bottom };
}

function getBlipIcon(icon) {
  const icons = {
    store: '<i class="fas fa-shopping-bag"></i>',
    tools: '<i class="fas fa-hammer"></i>',
    bank: '<i class="fas fa-university"></i>',
    shield: '<i class="fas fa-shield-alt"></i>',
    bar: '<i class="fas fa-glass-whiskey"></i>',
    hotel: '<i class="fas fa-bed"></i>',
    fuel: '<i class="fas fa-gas-pump"></i>',
    target: '<i class="fas fa-crosshairs"></i>',
    hospital: '<i class="fas fa-hospital"></i>',
    police: '<i class="fas fa-star"></i>',
    horse: '<i class="fas fa-horse"></i>',
    general: '<i class="fas fa-map-marker-alt"></i>'
  };
  return icons[icon] || icons.general;
}

function initBlips() {
  if (TEST_MODE) {
    serverBlips = TestData.blips.map(blip => {
      const { left, bottom } = convertToMapPercent(blip.x, blip.y);
      return { ...blip, left, bottom };
    });
    renderBlipsInline();
  } else {
    renderBlipsInline();
  }
}

function renderBlipsInline() {
  const overlay = document.getElementById('mapBlipsInline');
  if (!overlay) return;
  overlay.innerHTML = '';
  
  if (serverBlips.length === 0) return;
  
  serverBlips.forEach(blip => {
    const blipElement = document.createElement('div');
    blipElement.className = 'map-blip';
    blipElement.dataset.id = blip.id;
    blipElement.dataset.name = blip.name;
    blipElement.dataset.description = blip.description || '';
    
    const left = blip.left !== undefined ? blip.left : (blip.x || 0);
    const bottom = blip.bottom !== undefined ? blip.bottom : (blip.y || 0);
    
    blipElement.style.cssText = `
      position: absolute;
      left: ${left}%;
      bottom: ${bottom}%;
      transform: translate(-50%, 50%);
      pointer-events: auto;
      cursor: pointer;
      z-index: 10;
    `;
    
    const iconSvg = getBlipIcon(blip.icon);
    blipElement.innerHTML = `
      <div class="blip-marker" style="
        width: 24px;
        height: 24px;
        background: ${blip.color || '#E8B84A'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        border: 2px solid rgba(255,255,255,0.3);
      ">
        <div style="transform: rotate(45deg); color: white; font-size: 10px;">
          ${iconSvg}
        </div>
      </div>
      <div class="blip-tooltip" style="
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.95);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
        margin-bottom: 5px;
        border: 1px solid ${blip.color || '#E8B84A'};
        z-index: 100;
      ">
        <div style="font-weight:bold; margin-bottom: 2px;">${blip.name}</div>
        ${blip.description ? `<div style="color:#aaa;font-size:10px;">${blip.description}</div>` : ''}
      </div>
    `;
    
    blipElement.addEventListener('mouseenter', function() {
      this.querySelector('.blip-tooltip').style.opacity = '1';
    });
    
    blipElement.addEventListener('mouseleave', function() {
      this.querySelector('.blip-tooltip').style.opacity = '0';
    });
    
    overlay.appendChild(blipElement);
  });
}

let mapZoom = 1;
let mapTranslateX = 0;
let mapTranslateY = 0;
let lastTranslateX = 0;
let lastTranslateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function zoomMapPanel(delta) {
  const zoomMin = Config.map.zoomMin || 0.5;
  const zoomMax = Config.map.zoomMax || 5.0;
  mapZoom += delta;
  mapZoom = Math.max(zoomMin, Math.min(zoomMax, mapZoom));
  updateMapPanelTransform();
}

function resetMapPanel() {
  mapZoom = 1;
  mapTranslateX = 0;
  mapTranslateY = 0;
  lastTranslateX = 0;
  lastTranslateY = 0;
  updateMapPanelTransform();
}

function updateMapPanelTransform() {
  const container = document.getElementById('mapZoomContainer');
  const zoomLevel = document.getElementById('mapZoomLevel');
  
  if (container) {
    container.style.transform = `translate(calc(-50% + ${mapTranslateX}px), calc(-50% + ${mapTranslateY}px)) scale(${mapZoom})`;
  }
  
  if (zoomLevel) {
    zoomLevel.textContent = Math.round(mapZoom * 100) + '%';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('mapZoomContainer');
  if (mapContainer) {
    mapContainer.addEventListener('mousedown', function(e) {
      if (e.target.closest('.map-blip')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastTranslateX = mapTranslateX;
      lastTranslateY = mapTranslateY;
      this.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      mapTranslateX = lastTranslateX + deltaX;
      mapTranslateY = lastTranslateY + deltaY;
      updateMapPanelTransform();
    });
    
    document.addEventListener('mouseup', function() {
      isDragging = false;
      if (mapContainer) mapContainer.style.cursor = 'grab';
    });
    
    mapContainer.addEventListener('wheel', function(e) {
      e.preventDefault();
      const zoomStep = Config.map.zoomStep || 0.2;
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      zoomMapPanel(delta);
    });
  }
});

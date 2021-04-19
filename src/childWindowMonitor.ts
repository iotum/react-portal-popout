import * as globalContext from './globalContext';
import PopoutMap from './popoutMap';

const monitors: { [id: string]: any } = {};

const delay = 250; // ms

function stop(id: string): void {
  if (monitors[id]) {
    clearTimeout(monitors[id]);
    delete monitors[id];
  }
}

function start(id: string): void {
  function monitor(): void {
    if (PopoutMap[id] && PopoutMap[id].props.onClose) {
      if (!PopoutMap[id].child || PopoutMap[id].child!.closed) {
        stop(id);
        PopoutMap[id].props.onClose!();
        PopoutMap[id].child = null;
      } else {
        monitors[id] = setTimeout(monitor, delay);
      }
    }
  }

  monitors[id] = setTimeout(monitor, delay);
}

globalContext.set('startMonitor', start);

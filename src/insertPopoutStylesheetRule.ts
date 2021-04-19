import Popout from './Popout';
import PopoutMap from './popoutMap';

export default function insertPopoutStylesheetRule(rule: string) {
  Object.keys(PopoutMap).forEach((popoutKey: string) => {
    const popout: Popout = PopoutMap[popoutKey];
    if (popout.child && popout.styleElement) {
      try {
        const { sheet }: HTMLStyleElement = popout.styleElement;
        sheet?.insertRule(rule, sheet?.cssRules.length);
      } catch (e) {
        /* no-op on errors */
      }
    }
  });
}

const id: string = '__$$REACT_POPOUT_COMPONENT$$__';

export function set(key: string, value: any): void {
  (window as any)[id] = (window as any)[id] || {};
  (window as any)[id][key] = value;
}

export function get(key: string): any {
  return (window as any)[id] && (window as any)[id][key];
}

export { id };

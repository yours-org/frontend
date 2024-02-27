import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useEventListener from '@/utils/hooks/useEventListener';

describe('useEventListener', () => {
  it('calls event handler when specified event is triggered on window', () => {
    const handler = jest.fn();
    renderHook(() => useEventListener('click', handler));

    act(() => {
      const event = new Event('click');
      window.dispatchEvent(event);
    });

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.any(Event));
  });

  it('calls event handler when specified event is triggered on element', () => {
    const handler = jest.fn();

    // Create a mock element and ref object for the test
    const element = document.createElement('div');
    const refObject = { current: element };

    renderHook(() => useEventListener('click', handler, refObject));

    act(() => {
      const event = new Event('click');
      element.dispatchEvent(event);
    });

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.any(Event));
  });
});

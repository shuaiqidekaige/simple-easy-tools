import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
export default function createSnapsShops(received) {
  try {
    expect(toJson(render(received))).toMatchSnapshot();

    return {
      message: () => 'expected JSX not to match snapshot',
      pass: true,
    };
  } catch (e) {
    return {
      message: () => `expected JSX to match snapshot: ${e.message}`,
      pass: false,
    };
  }
}
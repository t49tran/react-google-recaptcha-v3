import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

(Enzyme as any).configure({ adapter: new Adapter() });

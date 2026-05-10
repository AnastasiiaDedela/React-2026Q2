import { Component } from 'react';

class BuggyComponent extends Component {
  render() {
    throw new Error('Test error triggered');
    return null;
  }
}

export default BuggyComponent;

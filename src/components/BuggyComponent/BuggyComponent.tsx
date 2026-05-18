function BuggyComponent(): never {
  throw new Error('Test error triggered');
}

export default BuggyComponent;

test('Jest and DOM assertions are runnable', (): void => {
  const node: HTMLElement = document.createElement('main');
  document.body.append(node);
  expect(node).toBeInTheDocument();
  node.remove();
});

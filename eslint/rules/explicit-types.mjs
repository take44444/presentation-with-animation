/** Enforce annotations even where TypeScript could infer a declaration's type. */
const rule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      annotation: 'Add an explicit type annotation.',
      forbidden: 'The any type is forbidden.',
    },
  },
  create(context) {
    const check = (node) => {
      if (!node.typeAnnotation)
        context.report({ node, messageId: 'annotation' });
    };
    const fn = (node) => {
      if (!node.returnType) context.report({ node, messageId: 'annotation' });
      for (const parameter of node.params)
        check(
          parameter.type === 'AssignmentPattern' ? parameter.left : parameter,
        );
    };
    return {
      VariableDeclarator(node) {
        check(node.id);
      },
      PropertyDefinition: check,
      TSParameterProperty(node) {
        check(node.parameter);
      },
      TSAnyKeyword(node) {
        context.report({ node, messageId: 'forbidden' });
      },
      FunctionDeclaration: fn,
      FunctionExpression: fn,
      ArrowFunctionExpression: fn,
    };
  },
};

export default rule;

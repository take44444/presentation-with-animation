/** Require JSDoc for exported functions, classes and interfaces. */
const rule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: { docs: 'Document this public contract with JSDoc.' },
  },
  create(context) {
    const check = (node) => {
      const declaration = node.declaration;
      if (!declaration) return;
      const isFunction =
        declaration.type === 'VariableDeclaration' &&
        declaration.declarations.some((entry) =>
          ['ArrowFunctionExpression', 'FunctionExpression'].includes(
            entry.init?.type,
          ),
        );
      if (
        !isFunction &&
        ![
          'FunctionDeclaration',
          'ClassDeclaration',
          'TSInterfaceDeclaration',
        ].includes(declaration.type)
      )
        return;
      const comments = context.sourceCode.getCommentsBefore(node);
      if (
        !comments.some(
          (comment) =>
            comment.type === 'Block' && comment.value.startsWith('*'),
        )
      )
        context.report({ node, messageId: 'docs' });
    };
    return { ExportNamedDeclaration: check, ExportDefaultDeclaration: check };
  },
};

export default rule;

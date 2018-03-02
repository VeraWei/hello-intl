export default function ({types: t}) {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.operator !== "===") {
          return;
        }

        path.node.left = t.identifier("semack");
        path.node.right = t.identifier("dork");
      }
    }
  }
}

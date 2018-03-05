export default function ({types: t}) {
  return {
    visitor: {
      StringLiteral(path, state) {
        if(/[\u4e00-\u9fa5]/.test(path.node.value)) {
          state.opts.stringNodes.push(path.node.value);
        }
      },
      JSXText(path, state){
        if(/[\u4e00-\u9fa5]/.test(path.node.value)) {
          state.opts.stringNodes.push(path.node.value);
        }
      }
    }
  }
}
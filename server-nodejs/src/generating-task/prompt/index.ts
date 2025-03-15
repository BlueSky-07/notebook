import { EdgeEntity } from '../../edge/edge.entity';
import { NodeEntity } from '../../node/node.entity';

export function generatePromptFromTargetNodeByNodesAndEdges(
  targetNode: NodeEntity,
  nodes: NodeEntity[],
  edges: EdgeEntity[],
) {
  const prompts: string[] = [];
  for (const edge of edges) {
    const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
    if (!sourceNode?.data?.content) continue;
    prompts.push(`<reference>
${edge.id}号材料: ${edge.data.label || ''}
<content>
${sourceNode.data.content}
</content>
</reference>`);
  }
  if (!prompts.length) {
    return targetNode.data.content || ''
  }
  return [
    `有一组文字材料，格式如下：
<reference>
材料的序号: 这份材料对于输出内容的作用
<content>
材料内容
</content>
</reference>

<reference>
下一份材料的序号: 这份材料对于输出内容的作用
<content>
材料内容
</content>
</reference>

其余的材料以此类推，材料如下：`,
    ...prompts,
    `
请你理解以上材料，${targetNode.data.content || '续写一段长度大约200字的文章'}，请不要做任何额外的解释。续写内容如下：`,
    ...prompts,
  ].join('\n');
}

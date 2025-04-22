import { EdgeEntity } from '../../edge/edge.entity';
import { NodeDataType, NodeEntity } from '../../node/node.entity';
import { GeneratingTaskInputPromptType } from '../generating-task.entity';
import { PromptPart } from './type';

export function generatePromptFromTargetNodeByNodesAndEdges(
  targetNode: NodeEntity,
  nodes: NodeEntity[],
  edges: EdgeEntity[],
): PromptPart[] {
  switch (targetNode.dataType) {
    case NodeDataType.Text: {
      return generatePromptForTextTargetNode(targetNode, nodes, edges);
    }
    case NodeDataType.Image: {
      return generatePromptForImageTargetNode(nodes, edges);
    }
  }
}

export function generatePromptForTextTargetNode(
  targetNode: NodeEntity,
  nodes: NodeEntity[],
  edges: EdgeEntity[],
): PromptPart[] {
  const prompts: PromptPart[] = [];

  for (const edge of edges) {
    const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
    if (!sourceNode?.dataType) continue;
    if (sourceNode.layout.hidden) continue; // skip hidden connection
    switch (sourceNode.dataType) {
      case NodeDataType.Text: {
        if (!sourceNode.data.content) continue;
        prompts.push({
          type: GeneratingTaskInputPromptType.Text,
          text: `<reference type="文字" id="${edge.id}" purpose="${edge.data.label || '参考'}">
  ${sourceNode.data.content}
  </reference>`,
        });
        break;
      }
      case NodeDataType.Image: {
        if (!sourceNode.data.src) continue;
        prompts.push(
          {
            type: GeneratingTaskInputPromptType.Text,
            text: `<reference type="图片" id="${edge.id}" purpose="${edge.data.label || '参考'}">`,
          },
          {
            type: GeneratingTaskInputPromptType.Image,
            src: sourceNode.data.src,
          },
          {
            type: GeneratingTaskInputPromptType.Text,
            text: `</reference>`,
          },
        );
        break;
      }
    }
  }

  if (!prompts.length) {
    return [
      {
        type: GeneratingTaskInputPromptType.Text,
        text: targetNode.data.content || '',
      },
    ];
  }
  return [
    {
      type: GeneratingTaskInputPromptType.Text,
      text: `有一组材料，格式如下：

<reference id="材料ID" type="文字" purpose="材料目的">
文字材料内容
</reference>
<reference id="材料ID" type="图片" purpose="材料目的">
图片材料内容
</reference>

所有的材料如下：`,
    },
    ...prompts,
    {
      type: GeneratingTaskInputPromptType.Text,
      text: `
请你理解以上材料，不要做任何额外的解释，
${
  targetNode.data.content ||
  {
    [NodeDataType.Text]:
      '续写一段长度大约200字的文章，续写内容不可以使用<reference>包裹。续写内容如下：',
    [NodeDataType.Image]: '生成一张图片',
  }[targetNode.dataType]
}`,
    },
  ];
}

export function generatePromptForImageTargetNode(
  nodes: NodeEntity[],
  edges: EdgeEntity[],
): PromptPart[] {
  const prompts: PromptPart[] = [];

  for (const edge of edges) {
    const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
    if (!sourceNode?.dataType) continue;
    if (sourceNode.layout.hidden) continue; // skip hidden connection
    switch (sourceNode.dataType) {
      case NodeDataType.Text: {
        if (!sourceNode.data.content) continue;
        prompts.push({
          type: GeneratingTaskInputPromptType.Text,
          text: [
            edge.data.label && `${edge.data.label}:`,
            sourceNode.data.content,
          ]
            .filter(Boolean)
            .join('\n'),
        });
        break;
      }
      case NodeDataType.Image: {
        // not support image generation from image
        break;
      }
    }
  }

  if (!prompts.length) {
    return [
      {
        type: GeneratingTaskInputPromptType.Text,
        text: '',
      },
    ];
  }

  return [
    ...prompts,
    {
      type: GeneratingTaskInputPromptType.Text,
      text: '\n\n根据以上内容，生成一张图片',
    },
  ];
}

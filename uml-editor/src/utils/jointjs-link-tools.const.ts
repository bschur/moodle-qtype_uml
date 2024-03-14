import { dia, linkTools } from '@joint/core'

export const globalLinkToolsView = new dia.ToolsView({
  tools: [
    new linkTools.Vertices(),
    new linkTools.Segments(),
    new linkTools.SourceArrowhead(),
    new linkTools.TargetArrowhead(),
    new linkTools.SourceAnchor(),
    new linkTools.TargetAnchor(),
    new linkTools.Boundary(),
    new linkTools.Remove(),
  ],
})

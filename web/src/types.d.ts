declare module "*.less" {
  const styles: {[key: string]: string}
  export default styles
}

declare module "*.svg" {
  import * as React from "react"

  const SvgReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >

  export default SvgReactComponent
}
// global.d.ts
import { GlobalFlexTableInterface } from './app/reusable/ui/flextable/flextable-options.ts';

declare global {
  interface FlexTableInterface extends GlobalFlexTableInterface {}
}

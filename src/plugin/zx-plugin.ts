import { Type } from "../core/utils/type.utils.js";

export interface ZxPlugin {
  name: string;
  isCurrentOsSupported(): boolean;
}

export function createPlugin<T extends ZxPlugin>(clz: Type<T>): T {
  const plugin = new clz();
  const proxy = new Proxy(plugin, {
    get: (pluginTarget: T, key: string | symbol): any => {
      if (typeof pluginTarget[key] !== "function") {
        return pluginTarget[key];
      } else {
        return new Proxy(pluginTarget[key], {
          apply: (
            methodTarget: Function,
            thisArg: any,
            argArray: any[]
          ): any => {
            if (!pluginTarget.isCurrentOsSupported()) {
              throw new Error(
                `'${pluginTarget.name}' plugin does not support current OS.`
              );
            }

            return methodTarget.apply(pluginTarget, argArray);
          },
        });
      }
    },
  });
  return proxy;
}

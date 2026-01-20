import { container as tsyringeContainer } from "tsyringe";

/**
 * Adapter para integrar tsyringe com routing-controllers
 * Permite que o routing-controllers use o container do tsyringe
 * para resolver dependências das controllers
 */
export const container = {
  get<T>(someClass: new (...args: any[]) => T): T {
    return tsyringeContainer.resolve(someClass);
  },
};

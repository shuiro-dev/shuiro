// src/services/dsl/fakerWrappers.ts

import { faker } from "@faker-js/faker"

/** float(0..1) 用 */
export function floatBetween(
  min: number,
  max: number,
  fractionDigits: number,
): number {
  return faker.number.float({ fractionDigits, max, min })
}

/** int(1..100) 用 */
export function numberBetween(min: number, max: number): number {
  return faker.number.int({ max, min })
}

/** word() 用 */
export function randomWord(): string {
  return faker.word.sample()
}
